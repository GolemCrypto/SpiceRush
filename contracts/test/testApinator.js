const { expect } = require("chai");
const { waffle } = require("hardhat");
const provider = waffle.provider;
var fs = require('fs');

describe("Basic test", function() {

  it("Should deploy contracts", async function() {
    accounts = await ethers.getSigners()
    myAddress = accounts[0].address;

    Factory = await ethers.getContractFactory("APExN");
    apinator = await Factory.deploy()
    await apinator.deployed()
    Factory = await ethers.getContractFactory("ApinatorPropertyEstate");
    apinatorProperty = await Factory.deploy()
    await apinatorProperty.deployed()
    Factory = await ethers.getContractFactory("Spice");
    spice = await Factory.deploy()
    await spice.deployed()
    Factory = await ethers.getContractFactory("Buildings");
    buildings = await Factory.deploy(apinator.address, apinatorProperty.address)
    await buildings.deployed()
    Factory = await ethers.getContractFactory("Gameplay");
    gameplay = await Factory.deploy(apinator.address, apinatorProperty.address, spice.address, buildings.address)
    await gameplay.deployed()

    await buildings.updateOperator(gameplay.address, true)
    console.log(await spice.balanceOf(accounts[0].address))
    await spice.connect(accounts[0]).transfer(accounts[1].address, "10000000000000000000000")
                                                                    8099999999999999999000
    await spice.connect(accounts[1]).approve(gameplay.address, "100000000000000000000000000")
    await spice.connect(accounts[0]).approve(gameplay.address, "100000000000000000000000000")


    await gameplay.setDifficulty(20)

    await apinatorProperty.setOperator(gameplay.address, true)
    await apinatorProperty.setPrestoredMap([-10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -7, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -4, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    // console.log(accounts[0].address, 0)
    // console.log(accounts[1].address, 1)
    // console.log(accounts[2].address, 2)
    // console.log(accounts[3].address, 3)

    // whitelist
    await apinator.setPresaleActive(true)
    await apinator.setIsActive(true)

    await apinator.setRootAndMax("26688324482846751000766427515347292429933628036404840127671947910670369663889", 4) //3b010e6d3bb0f085faa51d615cc393c3fc69e7624b96430313b1ece81aabab91

    await apinator.connect(accounts[2]).mintNFTDuringPresale(2, [
        '0x0000000000000000000000003c0c909f1969f98bb25735883f03f1c64566c559',
        '0x51fd70225efd1edcc09da47510c13d4d2ae43d79271f35516b26bf6c102c9ed6',
        '0xe35017d4f76a99b30f01555eb59218b6618cf8353864d0610da66a208a278065',
        '0xd2995d67049503ff0cfbe4f0fe4e81f8a43bb732155f033b430e8e8e4644a79f',
        '0x238814a3562d9aca6a543f1c2a95dd95729e7ad6a3dd092b3ea21049e07752fd',
        '0x5f0a1617cb9f56fee64798a6911c12c7febcc5c8c621d00f6920cd5f9a249eea',
        '0x0a4ed5bf05ea6e3611a9da4e62aff41719b220b67f2119d22890bde842c87ddc',
        '0x5e2b62bcefeb70efcef351fc4545d9017146a082b070d40c3bc2ec8bb357c334',
        '0xf7ff75b8c6b369ab8417190600ca48939dc291fc7ac40d3bd5600644d747c1da'
      ], {value: ethers.utils.parseEther("0.5")})



    // giveaways
    await apinator.setFreeMintActive(true)
    await apinator.connect(accounts[2]).mintNFTDuringPresale(1, [
        '0x0000000000000000000000003c0c909f1969f98bb25735883f03f1c64566c559',
        '0x51fd70225efd1edcc09da47510c13d4d2ae43d79271f35516b26bf6c102c9ed6',
        '0xe35017d4f76a99b30f01555eb59218b6618cf8353864d0610da66a208a278065',
        '0xd2995d67049503ff0cfbe4f0fe4e81f8a43bb732155f033b430e8e8e4644a79f',
        '0x238814a3562d9aca6a543f1c2a95dd95729e7ad6a3dd092b3ea21049e07752fd',
        '0x5f0a1617cb9f56fee64798a6911c12c7febcc5c8c621d00f6920cd5f9a249eea',
        '0x0a4ed5bf05ea6e3611a9da4e62aff41719b220b67f2119d22890bde842c87ddc',
        '0x5e2b62bcefeb70efcef351fc4545d9017146a082b070d40c3bc2ec8bb357c334',
        '0xf7ff75b8c6b369ab8417190600ca48939dc291fc7ac40d3bd5600644d747c1da'
      ], {value: ethers.utils.parseEther("0")})

    await apinator.setPresaleActive(false)
    // await apinator.connect(accounts[2]).mintNFT(2, {value: ethers.utils.parseEther("0.5")})

    await apinator.connect(accounts[2]).transferFrom(accounts[2].address, accounts[3].address, 1)
    // await apinator.connect(accounts[2]).transferFrom(accounts[2].address, accounts[4].address, 2)
    // await apinator.connect(accounts[2]).transferFrom(accounts[2].address, accounts[5].address, 3)
    // await apinator.connect(accounts[2]).transferFrom(accounts[2].address, accounts[6].address, 4)
    // await apinator.connect(accounts[2]).transferFrom(accounts[2].address, accounts[3].address, 0)
    
    await apinator.connect(accounts[3]).transferFrom(accounts[3].address, accounts[1].address, 1)
    // await apinator.connect(accounts[3]).transferFrom(accounts[3].address, accounts[1].address, 0)

    x = 0
    y = 0
    // await network.provider.send("evm_setNextBlockTimestamp", [4244522871])
    initialBalance = await provider.getBalance(accounts[1].address)
    await gameplay.connect(accounts[1]).spawn(1)
    console.log((initialBalance - await provider.getBalance(accounts[1].address)) / 1000000000)
    await gameplay.connect(accounts[1]).move(1, 0, 1)
    console.log(await gameplay.map(0, 1))
    await network.provider.send("evm_increaseTime", [2])
    await gameplay.connect(accounts[1]).mintTile(1, {value: ethers.utils.parseEther("0.5")})
    console.log(await apinatorProperty.getTileFromToken(0))
    // await gameplay.connect(accounts[1]).buildSpiceWell(1)
    // await gameplay.connect(accounts[1]).upgradeDrill(1)
    // await gameplay.connect(accounts[1]).buildSpiceWell(1)
    // await gameplay.connect(accounts[1]).buildSpiceWell(1)
    // await gameplay.connect(accounts[1]).buildSpiceWell(1)
    // await gameplay.connect(accounts[1]).buildSpiceWell(1)
    await apinatorProperty.connect(accounts[1]).setTileName("Coucou", 0, 1)
    await apinatorProperty.connect(accounts[1]).setTileColor(0x123456, 0, 1)
    console.log(await apinatorProperty.getTileFromToken(1))
    // await gameplay.connect(accounts[1]).mine(1, 10);
    console.log(await gameplay.charas(1));
    console.log((initialBalance - await provider.getBalance(accounts[1].address)) / 1000000000)
    await gameplay.connect(accounts[1]).move(1, 0, 0);
    await network.provider.send("evm_increaseTime", [2])
    for (let i = 1; i < 10; i++) {
        for (let j = 0; j < i; j++) {
            x += 1 * (1 - 2*(i%2 == 0))
            // console.log(await gameplay.charas(1))
            await gameplay.connect(accounts[1]).move(1, x, y)
            // console.log(await gameplay.map(x,y))
            await network.provider.send("evm_increaseTime", [2])
            await gameplay.connect(accounts[1]).rest(1, 10)
            await network.provider.send("evm_increaseTime", [20])
            console.log(x, y)
        }
        for (let j = 0; j < i; j++) {
            y += 1 * (1 - 2*(i%2 == 0))
            // console.log(await gameplay.charas(1))
            await gameplay.connect(accounts[1]).move(1, x, y);
            await network.provider.send("evm_increaseTime", [2])
            // console.log(await gameplay.map(x,y))
            await gameplay.connect(accounts[1]).rest(1, 10);
            await network.provider.send("evm_increaseTime", [20])
            console.log(x, y)
            console.log(await gameplay.map(x,y))
        }
    }
    // initialBalance = await provider.getBalance(accounts[1].address)

    // for (let i = 0; i < 50; i++){
    //     await gameplay.connect(accounts[1]).spawn(1)
    //     x = 0
    //     y = 0
    //     // try{
    //         for (let i = 0; i < 1000; i++) {
    //             dir = [[0,1], [1,0], [-1,0], [0,-1]][Math.floor(Math.random() * 4)]
    //             // console.log(await gameplay.charas(1))
    //             await gameplay.connect(accounts[1]).move(1, x+dir[0], y+dir[1])
    //             // console.log(await gameplay.map(x,y))
    //             await network.provider.send("evm_increaseTime", [2])
    //             await gameplay.connect(accounts[1]).rest(1, 10)
    //             await network.provider.send("evm_increaseTime", [20])
    //             x += dir[0]
    //             y += dir[1]
    //             console.log(x, y)
    //             if (await gameplay.isLevelUpAvailable(1)){
    //                 await gameplay.connect(accounts[1]).levelUp(1, 1)
    //                 await network.provider.send("evm_increaseTime", [2])
    //                 console.log("LEVEL UP")
    //             }
    //     }
    // // }
    //     // catch{
    //     //     console.log("DEAD")
    //     //     continue
    //     // }
    //     await gameplay.connect(accounts[1]).terminateSelf(1, true)
    // }

    // for (let i = 0; i < 200; i++){
    //     await gameplay.connect(accounts[1]).spawn(1)
    //     x = 0
    //     y = 0
    //     try{
    //         for (let i = 0; i < 100; i++) {
    //             dir = [[0,1], [1,0], [-1,0], [0,-1]][Math.floor(Math.random() * 4)]
    //             // console.log(await gameplay.charas(1))
    //             await gameplay.connect(accounts[1]).move(1, x+dir[0], y+dir[1])
    //             // console.log(await gameplay.map(x,y))
    //             await network.provider.send("evm_increaseTime", [2])
    //             await gameplay.connect(accounts[1]).rest(1, 10)
    //             await network.provider.send("evm_increaseTime", [20])
    //             x += dir[0]
    //             y += dir[1]
    //             console.log(x, y)
    //             if (await gameplay.isLevelUpAvailable(1)){
    //                 await gameplay.connect(accounts[1]).levelUp(1, 1)
    //                 await network.provider.send("evm_increaseTime", [2])
    //                 console.log("LEVEL UP")
    //             }
    //     }}
    //     catch{
    //         console.log("DEAD")
    //         continue
    //     }
    //     await gameplay.connect(accounts[1]).terminateSelf(1, true)
    // }

    await network.provider.send("evm_increaseTime", [2])
    // console.log(await gameplay.map(x,y))
    // console.log(await gameplay.charas(1))
    // console.log(await gameplay.bank(1))
    // await gameplay.connect(accounts[1]).mine(1, 10);
    // console.log(await gameplay.map(x,y))
    // console.log(await gameplay.charas(1))
    // console.log(await gameplay.bank(1))

    await gameplay.connect(accounts[0]).addRewards("100000000000000000000000")
    // for (i=0;i<5;i++){
    //   await gameplay.connect(accounts[1]).reduceFoes(1)
    // }
    // await gameplay.connect(accounts[1]).buildSpiceWell(1)
    // await gameplay.connect(accounts[1]).upgradeDrill(1)
    // await network.provider.send("evm_increaseTime", [20000])
    console.log(await spice.balanceOf(accounts[1].address))
    await gameplay.connect(accounts[1]).mine(1, 10)
    console.log(await gameplay.charas(1))
    await gameplay.connect(accounts[1]).refineOre(1, (await gameplay.charas(1)).oreBalance.toString())
    // console.log(await spice.balanceOf(gameplay.address))
    // await gameplay.connect(accounts[1]).collectWell(1)
    console.log(await spice.balanceOf(accounts[1].address))
    console.log(await spice.balanceOf(gameplay.address))

    console.log((initialBalance - await provider.getBalance(accounts[1].address)) / 1000000000)

    // mapLevel = []
    // mapSpice = []
    // mapFoes = []
    // for (let i = -50; i <= 50; i++) {
    //     lineSpice = []
    //     lineFoes = []
    //     lineLevel = []
    //     for (let j = -50; j <= 50; j++) {
    //         tile = await gameplay.map(i, j)
    //         lineSpice.push(parseInt(tile.spiceAmount.toString()))
    //         lineFoes.push(parseInt(tile.foesAmount.toString()))
    //         lineLevel.push(parseInt(tile.level.toString()))
    //     }
    //     mapSpice.push(lineSpice)
    //     mapFoes.push(lineFoes)
    //     mapLevel.push(lineLevel)
    // }

    // fs.writeFile ("mapSpice.json", JSON.stringify(mapSpice), function(err) {
    //     if (err) throw err;
    //     console.log('complete');
    //     }
    // );
    // fs.writeFile ("mapFoes.json", JSON.stringify(mapFoes), function(err) {
    //     if (err) throw err;
    //     console.log('complete');
    //     }
    // );
    // fs.writeFile ("mapLevel.json", JSON.stringify(mapLevel), function(err) {
    //     if (err) throw err;
    //     console.log('complete');
    //     }
    // );
    
    // await network.provider.send("evm_increaseTime", [20])
    // await gameplay.connect(accounts[1]).setName(1, "Apezor")
    // console.log(await gameplay.charas(1))

    // console.log(await gameplay.getTeamsSpice())
    // console.log(await gameplay.isLevelUpAvailable(1))

  });
});