/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Nintendo Mario Tiles, Educational use only
 */

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 480,
  zoom: 1.2, // Since we're working with 16x16 pixel tiles, let's scale up the canvas by 4x
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
var foodlayer;
//var player;
var layer;
var text;

//var nowx;
//var nowy;
//var move;       //正在移動中
//var face;       //面向哪個方向。

var stage;//用來存放地圖關卡json資料
var stageNum=[];
var stageFood=[];
let jsonfile="pic/0-99.json";

    let url0 = location.href;
      console.log(url0);
		//再來用去尋找網址列中是否有資料傳遞(QueryString)
    if( url0.indexOf('?')!=-1){
		    //之後去分割字串把分割後的字串放進陣列中
        let ary2 = url0.split('?');
        
        jsonfile = "pic/" + ary2[1].substr(-2) + ".json";       //倒數兩個字
    }
    
            //var mJson=$.ajax({url:"pic/0-99.json",async:false});
    $.getJSON(jsonfile ,function(json){
        stage =  json;
        //console.log(json.layers[1]);
    });
   
function Player_(x,y,face,move){              //定義Player物件
    
    this.nowx = x;
    this.nowy = y;
    this.face = face;
    this.move = move;
    
    this.role ;
}

let player=[];
player[0] = new Player_(2,2,0,-1);                //????
player[1] = new Player_(2,7,0,-1);                //????

function preload() {
  this.load.image("tilesimg", "pic/0-99.png");
  //this.load.spritesheet("hero", "dude.png", { frameWidth: 32, frameHeight: 48 });
  //this.load.spritesheet("hero", "Charas14.png", { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet("gini", "pic/pacman24.png", { frameWidth: 48, frameHeight: 48 });
      this.load.spritesheet("gini1", "pic/pacman242.png", { frameWidth: 48, frameHeight: 48 });
  //this.load.spritesheet("hero", "Charas144.png", 32, 48 );
  this.load.tilemapTiledJSON("mapjson",jsonfile);
    
  this.load.image('backpic', 'pic/backpic02.png');      //背景圖
    //consol.log(mapjson);
    
}

let s;

function create() {
    s = this.add.tileSprite(-120, 0, 600, 600, 'backpic');
    s.setOrigin(0, 0);
  // Load a map from a 2D array of tile indices
  // prettier-ignore
    //level = mapjson.
//  level = [
//    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
//    [  0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0 ],
//    [  0,  2,  2,  2,  0,  0,  0,  1,  2,  7,  0 ],
//    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
//    [  0,  0,  0, 14, 13, 14,  0,  0,  0,  0,  0 ],
//    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
//    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
//    [  0,  0, 14, 14, 14, 14, 14,  0,  0,  0, 15 ],
//    [  0,  0,  0,  0,  0,  0,  0,  0,  0, 15, 15 ],
//    [ 35, 36, 37,  0,  0,  0,  0,  0, 15, 15, 15 ],
//    [ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ],
//    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
//    [  0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0 ],
//    [  0,  5,  6,  7,  0,  0,  0,  5,  6,  7,  0 ],
//    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
//    [  0,  0,  0, 14, 13, 14,  0,  0,  0,  0,  0 ],
//    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
//    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
//    [  0,  0, 14, 14, 14, 14, 14,  0,  0,  0, 15 ],
//    [  0,  0,  0,  0,  0,  0,  0,  0,  0, 15, 15 ],
//    [ 35, 36, 37,  0,  0,  0,  0,  0, 15, 15, 15 ],
//    [ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ]
//  ];
  // When loading from an array, make sure to specify the tileWidth and tileHeight
  //map = this.add.tilemap({ data: level, tileWidth: 48, tileHeight: 48 });
  
  map= this.add.tilemap("mapjson");
  
  let tiles = map.addTilesetImage("0_99","tilesimg");
  //const layer = map.createStaticLayer(0, tiles, 0, 0);
  foodlayer = map.createDynamicLayer("food", tiles, 0, 0);  
  let numlayer = map.createStaticLayer("number", tiles, 0, 0);
  //layer = map.createLayer(tiles);
  //layer.resizeWorld();
    
    
  
  //產生玩家角色  
  player[0].role = this.add.sprite(player[0].nowx*48, player[0].nowy*48, "gini").setOrigin(0,0);     //this.add.image(0, 0, 'sky').setOrigin(0, 0)
    player[1].role = this.add.sprite(player[1].nowx*48, player[1].nowy*48, "gini1").setOrigin(0,0);
  //nowx = 2;
  //nowy = 2;
  //move = -1;
  //player.animations.add('walk', [0, 1, 2, 1]);
  //player.animations.play('walk', 10, true);
    
    //角色0 朝四個方向的動畫
  this.anims.create({
    key: 'left0',
    frames: this.anims.generateFrameNumbers('gini', { start: 6, end: 11 }),
    frameRate: 15,
    repeat: -1
  });
  this.anims.create({
    key: 'right0',
    frames: this.anims.generateFrameNumbers('gini', { start: 0, end: 5 }),
    frameRate: 15,
    repeat: -1
  });
  this.anims.create({
    key: 'up0',
    frames: this.anims.generateFrameNumbers('gini', { start: 18, end: 23 }),
    frameRate: 15,
    repeat: -1
  });
  this.anims.create({
    key: 'down0',
    frames: this.anims.generateFrameNumbers('gini', { start: 12, end: 17 }),
    frameRate: 15,
    repeat: -1
  });
  player[0].role.anims.play('right0', true);
  //face = 0;           //面向右方

    
  this.anims.create({
    key: 'left1',
    frames: this.anims.generateFrameNumbers('gini1', { start: 6, end: 11 }),
    frameRate: 15,
    repeat: -1
  });
  this.anims.create({
    key: 'right1',
    frames: this.anims.generateFrameNumbers('gini1', { start: 0, end: 5 }),
    frameRate: 15,
    repeat: -1
  });
  this.anims.create({
    key: 'up1',
    frames: this.anims.generateFrameNumbers('gini1', { start: 18, end: 23 }),
    frameRate: 15,
    repeat: -1
  });
  this.anims.create({
    key: 'down1',
    frames: this.anims.generateFrameNumbers('gini1', { start: 12, end: 17 }),
    frameRate: 15,
    repeat: -1
  });
  player[1].role.anims.play('right1', true);         //一開始面向右


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

  text = this.add.text(16, 16, "hello", { font: "15px Arial", fill: "#bf0044" });//??
  //text.inputEnabled = true;

    
      //  console.log(typeof stage);
    for (i = 0; i < 10; i++) {
        stageNum[i] = [];
        stageFood[i] = [];
    }
    for (i=0 ; i<100 ; i++){
        stageNum[ Math.floor(i/10)][i%10] = stage.layers[1].data[i]-1;
        stageFood[ Math.floor(i/10)][i%10] = stage.layers[0].data[i];
        //stage0[0][i] = i;
    }
    console.log(stageNum); console.log(stageFood);

}
            //update ==========================================
function update(time, delta) {
  // Apply the controls to the camera each update tick of the game
  controls.update(delta);

    if(s.x>-5){s.x=-120;} else{s.x+=0.5} 
    
  if (keys.P.isDown){
    foodlayer.fill(0, 1, 1, 2, 2);
    //level[1][1]=35;
    //console.log('aaaaa');
  }
  else{
   // map.fill(1, 1, 1, 2, 2);
  }
  if (keys.R.isDown){
      
      if(s.x>116){s.x=0;} else{s.x+=0.5}   //console.log(s);
      
    //fillTiles();

    //level[1][1]=35;
    
  }

  if (keys.A.isDown)
  {
    //player.x-=18/delta;
    //player.setVelocityX(-16);
    //move_left();
    //player.anims.play('left', true);
  }
  if (keys.D.isDown)
  {
    //player.x+=12/delta;
    //player.anims.play('right', true);
    //move_right();
  }
  if (keys.W.isDown)
  {
    //move_up();
    //player.y-=18/delta;
    //player.anims.play('up', true);
  }
  if (keys.S.isDown)
  {
    //move_down();
    //player.y+=18/delta;
    //player.anims.play('down', true);
  }

  
  move_(0,delta);
   move_(1,delta); 

  text.setText("Tile X: " + Math.floor(player[0].role.x/48) +" Y: " + Math.floor(player[0].role.y/48));
  //text ='Tile X: ' + player.x;
}
// update 結束


function move_(n,delta){                   //n 角色0或1
    
  if(player[n].move != -1){                     //判斷是否在移動中
    if(player[n].move == 0){                    //判斷是否方向向右
      if( player[n].role.x < (player[n].nowx + 1) * 48){
        player[n].role.x+=18/delta;
      }else{
        player[n].role.x = (player[n].nowx + 1) * 48;
        player[n].nowx++;
        player[n].move= -1;
          foodlayer.fill(0, player[n].nowx, player[n].nowy, 1, 1);      //食物消失
      }
    }

    if(player[n].move == 1){                    //判斷是否方向向上
      if( player[n].role.y > (player[n].nowy - 1) * 48){
        player[n].role.y-=18/delta;
      }else{
        player[n].role.y = (player[n].nowy - 1) * 48;
        player[n].nowy--;
        player[n].move= -1;
          foodlayer.fill(0, player[n].nowx, player[n].nowy, 1, 1);
      }
    }

    if(player[n].move == 2){                    //判斷是否方向向左
      if( player[n].role.x > (player[n].nowx - 1) * 48){
        player[n].role.x-=18/delta;
      }else{
        player[n].role.x = (player[n].nowx - 1) * 48;
        player[n].nowx--;
        player[n].move= -1;
          foodlayer.fill(0, player[n].nowx, player[n].nowy, 1, 1);
      }
    }

    if(player[n].move == 3){                    //判斷是否方向向下
      if( player[n].role.y < (player[n].nowy + 1) * 48){
        player[n].role.y+=18/delta;
      }else{
        player[n].role.y = (player[n].nowy + 1) * 48;
        player[n].nowy++;
        player[n].move= -1;
          foodlayer.fill(0, player[n].nowx, player[n].nowy, 1, 1);
      }
    }

  }
}

//
function fillTiles() {              //???

    //map.fill(31, layer.getTileX(player.x), layer.getTileY(player.y), 1, 1);
    map.fill(31, Math.floor(player.role.x/48), Math.floor(player.role.y/48), 1, 1);

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


function move_right(n) {
  
  player[n].role.anims.play('right'+n, true);
  
  if(player[n].move == -1){
    player[n].move = 0;
    player[n].face = player[n].move;
  }

}

function move_left(n) {
  player[n].role.anims.play('left'+n, true);
  if(player[n].move == -1){
    player[n].move = 2;       //移動方向為左
    player[n].face = player[n].move;
  }
}
function move_up(n) {
  player[n].role.anims.play('up'+n, true);
  if(player[n].move == -1){
    player[n].move = 1;       //移動方向為上
    player[n].face = player[n].move;
  }
}
function move_down(n) {
  player[n].role.anims.play('down'+n, true);
  if(player[n].move == -1){
    player[n].move = 3;       //移動方向為下
    player[n].face = player[n].move;
  }
}


//function move_forward() {               //前進

  //if (player[n].face == 0){move_right();}
  //if (player[n].face == 1){move_up();}
  //if (player[n].face == 2){move_left();}
  //if (player[n].face == 3){move_down();}
//}

let eatNum = 0;         //已吃掉的食物量
function eat(num000,N) {                        //吃(要吃掉的數字,第N個角色)

    let num = 0;
    if (num000>='A' ){
        num = num000.charCodeAt(0)-1;          //?? 該字元的ASCII CODE 減1
    }else{
        num = num000;
    }
    
    //console.log(stageNum[player[N].nowy][player[N].nowx+1]);
    if ((stageNum[player[N].nowy][player[N].nowx+1] == num) && (stageFood[player[N].nowy][player[N].nowx+1] == 35)){
        move_right(N);
        //setTimeout( foodlayer.fill(0, nowx+1, nowy, 1, 1) , 1000 );
        //foodlayer.fill(0, nowx+1, nowy, 1, 1);
        //console.log("1000");
        stageFood[player[N].nowy][player[N].nowx+1] = 0;
        eatNum++;
    }
    else if ((stageNum[player[N].nowy-1][player[N].nowx] == num) && (stageFood[player[N].nowy-1][player[N].nowx] == 35)){
        move_up(N);
        //foodlayer.fill(0, nowx, nowy-1, 1, 1);
        stageFood[player[N].nowy-1][player[N].nowx] = 0;
        eatNum++;
    }
    else if ((stageNum[player[N].nowy][player[N].nowx-1] == num) && (stageFood[player[N].nowy][player[N].nowx-1] == 35)){
        move_left(N);
        //foodlayer.fill(0, nowx-1, nowy, 1, 1);
        stageFood[player[N].nowy][player[N].nowx-1] = 0;
        eatNum++;
    }
    else if ((stageNum[player[N].nowy+1][player[N].nowx] == num) && (stageFood[player[N].nowy+1][player[N].nowx] == 35)){
        move_down(N);
        //foodlayer.fill(0, nowx, nowy+1, 1, 1);
        stageFood[player[N].nowy+1][player[N].nowx] = 0;
        eatNum++;
        
    }
    console.log(eatNum+","+ num);
}

