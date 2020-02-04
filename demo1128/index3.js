/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Nintendo Mario Tiles, Educational use only
 */

const config = {
  type: Phaser.AUTO,
  width: 336,
  height: 336,
  zoom: 1.5, // Since we're working with 16x16 pixel tiles, let's scale up the canvas by 4x
  pixelArt: true, // Force the game to scale images up crisply
  parent: "game-container",
  physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
  scene: {
    preload: preload,
    create: create,
    update: update
    //render: render
  }
};

const game = new Phaser.Game(config);
let controls;
var keys;
var level;
var map;
var player;
var layer;
var text;

var nowx;
var nowy;
var move;
var face;

function preload() {
  this.load.image("tilesimg", "pic/map01.png");
  //this.load.spritesheet("hero", "dude.png", { frameWidth: 32, frameHeight: 48 });
  //this.load.spritesheet("hero", "Charas14.png", { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet("hero", "pic/190.png", { frameWidth: 48, frameHeight: 48 });
  //this.load.spritesheet("hero", "Charas144.png", 32, 48 );
}

function create() {
  // Load a map from a 2D array of tile indices
  // prettier-ignore
  level = [
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
    [  0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0 ],
    [  0,  2,  2,  2,  0,  0,  0,  1,  2,  7,  0 ],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
    [  0,  0,  0, 14, 13, 14,  0,  0,  0,  0,  0 ],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
    [  0,  0, 14, 14, 14, 14, 14,  0,  0,  0, 15 ],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0, 15, 15 ],
    [ 35, 36, 37,  0,  0,  0,  0,  0, 15, 15, 15 ],
    [ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
    [  0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0 ],
    [  0,  5,  6,  7,  0,  0,  0,  5,  6,  7,  0 ],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
    [  0,  0,  0, 14, 13, 14,  0,  0,  0,  0,  0 ],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
    [  0,  0, 14, 14, 14, 14, 14,  0,  0,  0, 15 ],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0, 15, 15 ],
    [ 35, 36, 37,  0,  0,  0,  0,  0, 15, 15, 15 ],
    [ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ]
  ];

  // When loading from an array, make sure to specify the tileWidth and tileHeight
  map = this.make.tilemap({ data: level, tileWidth: 48, tileHeight: 48 });
  const tiles = map.addTilesetImage("tilesimg");
  //const layer = map.createStaticLayer(0, tiles, 0, 0);
  layer = map.createDynamicLayer(0, tiles, 0, 0);
  //layer = map.createLayer(tiles);
  //layer.resizeWorld();

  player = this.add.sprite(96, 96, "hero").setOrigin(0,0);     //this.add.image(0, 0, 'sky').setOrigin(0, 0)
  nowx = 2;
  nowy = 2;
  move = -1;
  //player.animations.add('walk', [0, 1, 2, 1]);
  //player.animations.play('walk', 10, true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
    frameRate: 2,
    repeat: -1
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 11 }),
    frameRate: 2,
    repeat: -1
  });
  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
    frameRate: 2,
    repeat: -1
  });
  this.anims.create({
    key: 'down',
    frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
    frameRate: 2,
    repeat: -1
  });
  player.anims.play('down', true);
  face = 3;           //面向下方



  const camera = this.cameras.main;

  const cursors = this.input.keyboard.createCursorKeys();
  controls = new Phaser.Cameras.Controls.FixedKeyControl({
    camera: camera,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    left: cursors.left,
    speed: 0.2
  });

  //camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  
  keys = this.input.keyboard.addKeys('P,W,A,S,D,R');

  text = this.add.text(16, 16, "hello", { font: "15px Arial", fill: "#ff0044" });
  //text.inputEnabled = true;

}

function update(time, delta) {
  // Apply the controls to the camera each update tick of the game
  controls.update(delta);

  if (keys.P.isDown){
    map.fill(30, 1, 1, 2, 2);
    //level[1][1]=35;
    //console.log('aaaaa');
  }
  else{
   // map.fill(1, 1, 1, 2, 2);
  }
  if (keys.R.isDown){
    fillTiles();
    //level[1][1]=35;
    //console.log('aaaaa');
  }

  if (keys.A.isDown)
  {
    //player.x-=18/delta;
    //player.setVelocityX(-16);
    move_left();
    //player.anims.play('left', true);
  }
  if (keys.D.isDown)
  {
    //player.x+=12/delta;
    //player.anims.play('right', true);
    move_right();
  }
  if (keys.W.isDown)
  {
    move_up();
    //player.y-=18/delta;
    //player.anims.play('up', true);
  }
  if (keys.S.isDown)
  {
    move_down();
    //player.y+=18/delta;
    //player.anims.play('down', true);
  }

  
  if(move != -1){                     //判斷是否在移動中
    if(move == 0){                    //判斷是否方向向右
      if( player.x < (nowx + 1) * 48){
        player.x+=18/delta;
      }else{
        player.x = (nowx + 1) * 48;
        nowx++;
        move= -1;
      }
    }

    if(move == 1){                    //判斷是否方向向上
      if( player.y > (nowy - 1) * 48){
        player.y-=18/delta;
      }else{
        player.y = (nowy - 1) * 48;
        nowy--;
        move= -1;
      }
    }

    if(move == 2){                    //判斷是否方向向左
      if( player.x > (nowx - 1) * 48){
        player.x-=18/delta;
      }else{
        player.x = (nowx - 1) * 48;
        nowx--;
        move= -1;
      }
    }

    if(move == 3){                    //判斷是否方向向下
      if( player.y < (nowy + 1) * 48){
        player.y+=18/delta;
      }else{
        player.y = (nowy + 1) * 48;
        nowy++;
        move= -1;
      }
    }

  }
  

  text.setText("Tile X: " + Math.floor(player.x/48));
  //text ='Tile X: ' + player.x;
}


function fillTiles() {

    //map.fill(31, layer.getTileX(player.x), layer.getTileY(player.y), 1, 1);
    map.fill(31, Math.floor(player.x/48), Math.floor(player.y/48), 1, 1);

}

//function render() {
    //game.debug.text('Click to fill tiles', 32, 32, 'rgb(0,0,0)');
    //text ='Tile X: ' + player.x;
    //text ='Tile Y: ' + player.y;
  // Input debug info
    //game.debug.inputInfo(32, 32);
    //game.debug.spriteInputInfo(sprite, 32, 130);
    //game.debug.pointer( game.input.activePointer );
//}


function move_right() {
  
  player.anims.play('right', true);
  
  if(move == -1){
    move = 0;
    face = move;
  }

  /*var stop_x = (nowx + 1) * 48 ;    //大於此座標即停止移動

  var int0 = self.setInterval(
    function(){
        if( player.x < stop_x ){
          player.x+=1;
        }
        else{
        clearInterval(int0);
        nowx = stop_x / 48 ;
        move= -1;
        } 
    }   ,40);
  */
}

function move_left() {
  player.anims.play('left', true);
  if(move == -1){
    move = 2;       //移動方向為左
    face = move;
  }
}
function move_up() {
  player.anims.play('up', true);
  if(move == -1){
    move = 1;       //移動方向為上
    face = move;
  }
}
function move_down() {
  player.anims.play('down', true);
  if(move == -1){
    move = 3;       //移動方向為下
    face = move;
  }
}


function move_forward() {               //前進

  if (face == 0){move_right();}
  if (face == 1){move_up();}
  if (face == 2){move_left();}
  if (face == 3){move_down();}
}