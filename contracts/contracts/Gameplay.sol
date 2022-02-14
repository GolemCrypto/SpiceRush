// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

contract Gameplay is Ownable {
    using SafeMath for uint256;

    IERC721 public apinator;

    constructor(address apinatorAddress){
        map[0][0] = Tile(true, 0, 0, 0);
        apinator = IERC721(apinatorAddress);
    }
    //TODO bonus : PVP? NFTTILES ERC20 MOVEABLESPAWN TPs
    struct Tile {
        bool isExplored;
        int16 level;
        uint256 spiceAmount;
        uint16 foesAmount;
    }
    struct Stats {
        uint16 hp;
        uint16 energy;
        uint16 mining;
        uint16 hpMax;
        uint16 energyMax;
        uint16 miningMax;
    }
    struct Chara {
        uint256 nextActionTime;
        int256 x;
        int256 y;
        Stats stats;
        uint16 xp;
        uint16 lvl;
    }
    mapping (uint256 => uint256) public bank;
	mapping (int256 => mapping(int256 => Tile)) public map;
    mapping (uint256 => Chara) public charas;
    uint256 actionTime = 1;
    uint256 spiceBlocksPerTile = 30;

    function setActionTime(uint256 _actionTime) public onlyOwner() {
        actionTime = _actionTime;
    }

    function setSpiceBlocksPerTile(uint256 _spiceBlocksPerTile) public onlyOwner() {
        spiceBlocksPerTile = _spiceBlocksPerTile;
    }

    function spawn(uint256 tokenId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].stats.hp == 0, "Not dead yet.");

        charas[tokenId] = Chara(0, 0, 0, Stats(10, 10, 10, 10, 10, 10), 0, 0);
    }

    function move(uint256 tokenId, int256 x, int256 y) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].stats.energy > 0, "No more energy.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        int256 dx = charas[tokenId].x - x;
        int256 dy = charas[tokenId].y - y;
        require(dx + dy == 1 || dx + dy == -1, "Wrong position.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");

        if (!map[x][y].isExplored) {
            explore(x, y);
            charas[tokenId].xp += 5*uint16(map[x][y].level);
        }
        if (charas[tokenId].stats.hp < map[x][y].foesAmount/10) {
            die(tokenId);
        }
        else{
            charas[tokenId].stats.hp -= map[x][y].foesAmount/3;
        }
        charas[tokenId].xp += 20;
        charas[tokenId].stats.energy -= 1;
        charas[tokenId].x = x;
        charas[tokenId].y = y;
        charas[tokenId].nextActionTime = block.timestamp + actionTime;
    }

    function mine(uint256 tokenId, uint16 actionNb) public {
        require(actionNb > 0, "Need at least one action.");
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        uint16 spiceAmount = uint16(map[charas[tokenId].x][charas[tokenId].y].spiceAmount);
        require(spiceAmount > 0, "Nothing to mine.");
        require(charas[tokenId].stats.energy >= actionNb, "Not enough energy.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");

        uint256 spiceMined = spiceAmount/spiceBlocksPerTile*actionNb;
        bank[tokenId] += uint16(spiceMined + spiceMined * charas[tokenId].stats.mining / 100);
        map[charas[tokenId].x][charas[tokenId].y].spiceAmount -= spiceMined;
        charas[tokenId].stats.energy -= actionNb;
        charas[tokenId].nextActionTime = block.timestamp + actionNb*actionTime;
        charas[tokenId].xp += uint16(spiceMined);
    }

    function rest(uint256 tokenId, uint16 actionNb) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(actionNb < 100, "Can't rest that long.");

        //TODO ERC20

        charas[tokenId].stats.energy = charas[tokenId].stats.energyMax;
        charas[tokenId].stats.hp = min(charas[tokenId].stats.hp + actionNb, charas[tokenId].stats.hpMax);
        charas[tokenId].nextActionTime = block.timestamp + actionTime*actionNb;
    }

    function levelUp(uint256 tokenId, uint8 statId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(statId < 4, "Not a stat id.");
        require(500*(charas[tokenId].lvl**2 + charas[tokenId].lvl) + 100 < charas[tokenId].xp, "Not enough xp.");

        charas[tokenId].lvl += 1;
        if (statId == 1) {
            charas[tokenId].stats.hpMax += 1;
            }
        else if (statId == 2) {
            charas[tokenId].stats.energyMax += 1;
            }
        else if (statId == 3) {
            charas[tokenId].stats.miningMax += 2;
            }
    }

    function selfTerminate(uint256 tokenId, bool agreement) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(agreement, "Need owner's agreement.");
        require(charas[tokenId].stats.hp > 0, "Already no hp.");

        die(tokenId);
    }

    function claimSpice(uint256 tokenId) public {
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(bank[tokenId] > 0, "Nothing to claim.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");

        bank[tokenId] = 0;
        charas[tokenId].nextActionTime = block.timestamp + actionTime;

        // TODO ERC20
    }

    function addSpice(uint256 tokenId) public {
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        
        // TODO ERC20

        bank[tokenId] += 0;
        charas[tokenId].nextActionTime = block.timestamp + actionTime;
    }

    function die(uint256 tokenId) internal {
        charas[tokenId].stats.hp = 0;
        map[charas[tokenId].x][charas[tokenId].y].spiceAmount += bank[tokenId];
        bank[tokenId] = 0;
    }

    // Assembly Optimizable
    function explore(int256 x, int256 y) internal {
        int256 mean;
        int256 cnt;
        if (map[x + 1][y].isExplored){
            mean += map[x + 1][y].level;
            cnt += 1;
        }
        if (map[x - 1][y].isExplored){
            mean += map[x - 1][y].level;
            cnt += 1;
        }
        if (map[x][y + 1].isExplored){
            mean += map[x][y + 1].level;
            cnt += 1;
        }
        if (map[x][y - 1].isExplored){
            mean += map[x][y - 1].level;
            cnt += 1;
        }
        mean = mean/cnt;
        int rand = getRand(block.difficulty, block.timestamp, int(mean));
        int16 level = int16(max(min(mean + (rand % 10), 100), 0));
        uint256 spice = uint256(max(min(mean + ((rand>>5) % 10), 100), 0)) * 100;
        uint16 foes = uint16(uint256(max(min(mean + ((rand>>10) % 10), 100), 0)));

        map[x][y] = Tile(true, level, spice, foes);
    }

    function getRand(uint256 a, uint256 b, int from) private pure returns (int) {
        int h = int(uint(keccak256(abi.encodePacked(a, b, from))));
        return h;
    }

    /// @notice Returns the greater of two numbers.
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a >= b ? a : b;
    }

    /// @notice Returns the lower of two numbers.
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a <= b ? a : b;
    }

    /// @notice Returns the lower of two numbers.
    function min(uint16 a, uint16 b) internal pure returns (uint16) {
        return a <= b ? a : b;
    }

    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }
}