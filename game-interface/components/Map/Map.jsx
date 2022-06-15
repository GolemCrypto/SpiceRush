import { useRef, useEffect, useContext, useState } from 'react';
import { GameContext } from "../../context/GameContext";
import styles from "./Map.module.scss";
import Phaser from "phaser";

const mapWidth = 20;
const mapHeight = 20;
const tileWidth = 64;
const tileHeight = 64;
let apePositionX;
let apePositionY;

let map;
let controls;
let marker;
let currentX = 0;
let currentY = 0;
let currentZoom = 1;
let camera;
let image;
let _this;
let clickOut = true;
let mapTiles;
let layer;
let spiceLayer;
let spiceValues;
let dangerLayer;
let dangerValues;
let userLayer;
let userValues;

export default function Map() {
    const gameContext = useContext(GameContext);
    const { playerDirection, characterInfo, tiles, setSelectedTile } = gameContext;
    const parentRef = useRef(null);
    const [game, setGame] = useState(null);
    const [spiceLayerVisible, setSpiceLayerVisible] = useState(false);
    const [usersLayerVisible, setUsersLayerVisible] = useState(false);
    const [dangerLayerVisible, setDangerLayerVisible] = useState(false);

    mapTiles = tiles;
    // Character position
    apePositionX = Math.abs(tiles[0].x - characterInfo.x) * tileWidth + tileWidth/2;
    apePositionY = Math.abs(tiles[0].y - characterInfo.y) * tileHeight + tileHeight/2;

    function preload() {
        this.load.image('tiles', 'assets/tiles_10.png');
        this.load.image('tiles_spice', 'assets/tile_spice.png');
        this.load.image('tiles_spice2', 'assets/tile_spice2.png');
        this.load.image('tiles_danger', 'assets/tile_danger.png');
        this.load.image('tiles_users', 'assets/tile_users.png');
        this.load.image('0', 'assets/0.png');
        this.load.image('1', 'assets/1.png');
        this.load.image('2', 'assets/2.png');
        this.load.image('3', 'assets/3.png');
        this.load.image('4', 'assets/4.png');
    }

    function RenderInfo(layer, canvasTexture, config = {}, type) {
        var tiles = layer.getTilesWithin(0, 0, layer.width, layer.height, config);

        if (!tiles.length) {
            return;
        }

        if (
            canvasTexture.width !== layer.width ||
            canvasTexture.height !== layer.height
        ) {
            // This also clears the texture!
            canvasTexture.setSize(layer.width, layer.height);
        }

        var ctx = canvasTexture.context;

        ctx.fillStyle = config.fillStyle || "white";
        ctx.font = config.font || "13px monospace";

        for (var i = 0, len = tiles.length; i < len; i++) {
            var tile = tiles[i];
            let tilePropertie;
            let paddingY;

            switch (type) {
                case 'spice': {
                    tilePropertie = tile.properties.spiceAmount;
                    paddingY = 18;
                }
                    break;
                case 'users': {
                    tilePropertie = 30;
                    paddingY = 32;
                }
                    break;
                case 'danger': {
                    tilePropertie = tile.properties.foesAmount;
                    paddingY = 46;
                }
                    break;
            }

            ctx.fillText(tilePropertie, tile.pixelX + 20, tile.pixelY + paddingY);
        }

        canvasTexture.refresh();
    }

    function create() {
        // For getting access outside create function
        _this = this;

        let level = [];
        let row = [];

        for (let i = 0; i <= mapTiles.length; i++) {
            if(row.length < mapWidth) {
                row.push(Math.floor(mapTiles[i].level / 10));
            } else {
                level.push(row);
                if(i !== mapTiles.length) {
                    row = [];
                    row.push(Math.floor(mapTiles[i].level / 10));
                }
            }
        }

        // Create THE map
        map = this.make.tilemap({ data: level, tileWidth, tileHeight });
        // Adding value to tiles
        map.forEachTile((tile, index)=>{
            tile.properties = mapTiles[index];
        })
        const tileset = map.addTilesetImage('tiles');
        layer = map.createLayer(0, tileset, 0, 0);

        // Creating spice tiles
        let spiceLevel = [];
        let spiceRow = [];

        for (let i = 0; i <= mapTiles.length; i++) {
            if(spiceRow.length < mapWidth) {
                // spiceRow.push(
                //     Math.floor(mapTiles[i].spiceAmount / 100) > 20
                //     ? 20
                //     : Math.floor(mapTiles[i].spiceAmount / 100)
                // );
                spiceRow.push(0)
            } else {
                spiceLevel.push(spiceRow);
                if(i !== mapTiles.length) {
                    spiceRow = [];
                    // spiceRow.push(
                    //     Math.floor(mapTiles[i].spiceAmount / 100) > 20
                    //     ? 20
                    //     : Math.floor(mapTiles[i].spiceAmount / 100)
                    // );
                    spiceRow.push(0)
                }
            }
        }

        // Spice layer
        const map2 = this.make.tilemap({ data: spiceLevel, tileWidth, tileHeight })
        const spiceTileset = map2.addTilesetImage('tiles_spice2');
        spiceLayer = map2.createLayer(0, spiceTileset, 0, 0);
        spiceLayer.visible = false;

         // Creating danger tiles
        let dangerLevel = [];
        let dangerRow = [];

        for (let i = 0; i <= mapTiles.length; i++) {
            if(dangerRow.length < mapWidth) {
                dangerRow.push(0)
            } else {
                dangerLevel.push(dangerRow);
                if(i !== mapTiles.length) {
                    dangerRow = [];
                    dangerRow.push(0)
                }
            }
        }

        // Danger layer
        const map3 = this.make.tilemap({ data: dangerLevel, tileWidth, tileHeight })
        const dangerTileset = map3.addTilesetImage("tiles_danger");
        dangerLayer = map3.createLayer(0, dangerTileset, 0, 0);
        dangerLayer.visible = false;

        // Creating users tiles
        let userLevel = [];
        let userRow = [];

        for (let i = 0; i <= mapTiles.length; i++) {
            if(userRow.length < mapWidth) {
                userRow.push(0)
            } else {
                userLevel.push(userRow);
                if(i !== mapTiles.length) {
                    userRow = [];
                    userRow.push(0)
                }
            }
        }

        // Users layer
        const map4 = this.make.tilemap({ data: userLevel, tileWidth, tileHeight })
        const userTileset = map4.addTilesetImage("tiles_users");
        userLayer = map4.createLayer(0, userTileset, 0, 0);
        userLayer.visible = false;


        // Adding cursor pointer in map
        marker = this.add.graphics();
        marker.lineStyle(3, 0xffffff, 1);
        marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

        // Setting camera
        camera = this.cameras.main
        camera.setBounds(0, 0, layer.width, layer.height);

        // Ape position
        image = this.add.image(apePositionX, apePositionY, '0');
        // 192 for grid 3x3 tiles, each tile 64px
        image.setDisplaySize(192,192);
        image.setDepth(1);

        // Keyboard listener
        const cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: camera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        };
        controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

        // Center camera in ape position
        camera.setZoom(currentZoom);
        currentX = apePositionX - parentRef.current.clientWidth/2;
        currentY = apePositionY - parentRef.current.clientHeight/2 + tileHeight/2;
        camera.setScroll(currentX, currentY);
        // Selecting ape position tile
        const apeTile = map.getTileAt(map.worldToTileX(apePositionX), map.worldToTileY(apePositionY));
        setSelectedTile(apeTile?.properties);

        // Adding text to tile
        const getTexture = (type) => {
            return this.textures.createCanvas(
                type,
                layer.width,
                layer.height
            )
        }

        RenderInfo(layer, getTexture("spice"), {
            isNotEmpty: true,
            fillStyle: "#ffffff"
        }, "spice");

        RenderInfo(layer, getTexture("users"), {
            isNotEmpty: true,
            fillStyle: "#ffffff"
        }, "users");

        RenderInfo(layer, getTexture("danger"), {
            isNotEmpty: true,
            fillStyle: "#ffffff"
        }, "danger");
    }

    function update(time, delta) {
        controls.update(delta);

        // Prevent interactions with outside canvas click
        if(clickOut) return;

        const worldPoint = this.input.activePointer.positionToCamera(camera);

        // Rounds down to nearest tile
        const pointerTileX = map.worldToTileX(worldPoint.x);
        const pointerTileY = map.worldToTileY(worldPoint.y);

        // Snap to tile coordinates, but in world space
        marker.x = map.tileToWorldX(pointerTileX);
        marker.y = map.tileToWorldY(pointerTileY);

        if (this.input.manager.activePointer.isDown) {
            const tile = map.getTileAt(pointerTileX, pointerTileY);

            if (tile) {
                setSelectedTile(tile.properties);
            }
        }
    }

    // Changing img for diferents move position
    function updateApeImage (position) {
        image.destroy();
        image = null;
        image = _this.add.image(apePositionX, apePositionY, ""+position);
    }

    // Update tile values
    function refreshMap () {
        map.forEachTile((tile)=>{
            tile.index = Phaser.Math.RND.integerInRange(0, 30);
        })
    }

    function mapControls (action) {
        switch (action) {
            case "down": {
                    const newY = currentY > tileHeight * currentZoom ? currentY * currentZoom + tileHeight : currentY * currentZoom
                    camera.setScroll(currentX,newY)
                    currentY = newY
                }
                break;
            case "rigth": {
                    const newX = currentX < 0 ? 0 + tileWidth : currentX + tileWidth
                    camera.setScroll(newX,currentY)
                    currentX = newX;
                }
                break;
            case "left": {
                    const newX = currentX < 0 ? 0 - tileWidth : currentX - tileWidth
                    camera.setScroll(newX,currentY)
                    currentX = newX;
                }
                break;
            case "up": {
                    const newY = currentY > tileHeight ? currentY - tileHeight : currentY
                    camera.setScroll(currentX,newY)
                    currentY = newY;
                }
                break;
            case "zoomIn":
                camera.setZoom(currentZoom + 0.1)
                currentZoom += 0.1
                break;
            case "zoomOut":
                camera.setZoom(currentZoom - 0.1)
                currentZoom -= 0.1
                break;
            default:
                console.log(`No control for ${action}.`);
        }
    }

    useEffect(() => {
        const startGame = new Phaser.Game({
            parent: parentRef.current,
            // width: tileWidth * width,
            // height: tileHeight * height,
            width: "100%",
            height: "100%",
            resolution: 1,
            pixelArt: true,
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        });
        setGame(startGame);

    // Refreshing map every 10 secs
    // const interval = setInterval(() => {
    //     refreshMap();
    // }, 10000);

    return () => {
        startGame.destroy();
    }
  }, []);

  // Handling Ape direction
  useEffect(() => {
    if(!image || !game) return;
    updateApeImage(playerDirection)
  }, [playerDirection]);

  useEffect(() => {
        if(!image || !game) return;
        image.destroy();
        image = null;
        image = _this.add.image(apePositionX, apePositionY, 0);

        // Selecting ape position tile
        const apeTile = map.getTileAt(map.worldToTileX(apePositionX), map.worldToTileY(apePositionY));
        setSelectedTile(apeTile?.properties);
  }, [characterInfo])

  const showPlayersLayer = () => {
    userLayer.visible = !userLayer.visible;
    if(userLayer.visible) {
        userValues = _this.add.image(0, 0, "users").setOrigin(0, 0);
    } else {
        userValues.destroy();
        userValues = null;
    }
    setUsersLayerVisible(userLayer.visible);
  }

  const showSpiceLayer = () => {
    spiceLayer.visible = !spiceLayer.visible;
    if(spiceLayer.visible) {
        spiceValues = _this.add.image(0, 0, "spice").setOrigin(0, 0);
    } else {
        spiceValues.destroy();
        spiceValues = null;
    }
    setSpiceLayerVisible(spiceLayer.visible);
  }

  const showDangerLayer = () => {
    dangerLayer.visible = !dangerLayer.visible;
    if(dangerLayer.visible) {
        dangerValues = _this.add.image(0, 0, "danger").setOrigin(0, 0);
    } else {
        dangerValues.destroy();
        dangerValues = null;
    }
    setDangerLayerVisible(dangerLayer.visible);
  }

  return (
      <div className={styles.mapContainer}>
          <div className={styles.spiceWrapper}>
            <div className={styles.spiceInfo}>
                <img src="/assets/spice_ore.png" alt="spice or icon"/>
                <div>
                    <p>Spice Ore</p>
                    <h4>{characterInfo.spiceMined}</h4>
                </div>
            </div>

            {/* <div className={styles.spiceInfo}>
                <img src="/assets/spice.png" alt="spice or icon"/>
                <div>
                    <p>Spice</p>
                    <h4>234 000</h4>
                </div>
            </div> */}
        </div>

        <div className={styles.assetsContainer}>
            <img className={styles.border} src="/assets/map_container.png" alt="map container" />
        </div>

        <div
            className={styles.mapWrapper}
            onMouseLeave={() => clickOut = true}
            onMouseEnter={() => clickOut = false}
            ref={parentRef}
        >
            <div
                onClick={() => mapControls('up')}
                className={styles.top}
                onMouseLeave={() => clickOut = false}
                onMouseEnter={() => clickOut = true}
            >
                <img src="/assets/map_up.png" alt="up" />
            </div>
            <div
                onClick={() => mapControls('rigth')}
                className={styles.right}
                onMouseLeave={() => clickOut = false}
                onMouseEnter={() => clickOut = true}
            >
                <img src="/assets/map_right.png" alt="right" />
            </div>
            <div
                onClick={() => mapControls('down')}
                className={styles.down}
                onMouseLeave={() => clickOut = false}
                onMouseEnter={() => clickOut = true}
            >
                <img src="/assets/map_down.png" alt="down" />
            </div>
            <div
                onClick={() => mapControls('left')}
                className={styles.left}
                onMouseLeave={() => clickOut = false}
                onMouseEnter={() => clickOut = true}
            >
                <img src="/assets/map_left.png" alt="left" />
            </div>

            <div className={styles.options}>
                <div>
                    <img
                        src={usersLayerVisible ? "/assets/user_on.png" : "/assets/user_off.png"}
                        alt="user icon"
                        onClick={() => showPlayersLayer()}
                    />
                    <img
                        src={spiceLayerVisible ? "/assets/spice_on.png" : "/assets/spice_off.png"}
                        onClick={() => showSpiceLayer()}
                        alt="spice icon"
                    />
                    <img
                        src={dangerLayerVisible ? "/assets/danger_on.png" : "/assets/danger_off.png"}
                        alt="danger icon"
                        onClick={() => showDangerLayer()}
                    />
                </div>

                <div>
                    <img src="/assets/shild_off.png" alt="shild icon" />
                    <img src="/assets/crown_on.png" alt="crown icon" />
                </div>

                <div>
                    <img
                        onClick={() => mapControls('zoomIn')}
                        src="/assets/zoom_in_off.png"
                        alt="zoom in icon"
                    />
                    <img
                        onClick={() => mapControls('zoomOut')}
                        src="/assets/zoom_out_off.png"
                        alt="zoom out icon"
                    />
                    <img src="/assets/full_screen_off.png" alt="full screen icon" />
                </div>
            </div>
        </div>
    </div>
  );
}