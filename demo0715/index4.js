/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Nintendo Mario Tiles, Educational use only
 */

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 480,
  zoom: 1.0,            // 設定場景縮放比例
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
  },
    audio: {
        disableWebAudio: true              //???
    }
};

const game = new Phaser.Game(config);
let controls;
var keys;
var level;
var map;
//var foodlayer;                  //?????
var objectLayer;
//var player;
var layer;
var text;
let diamondNum = 0;         //取得的鑽石數量
let diamondNeed = [0,1,1,1,1,1,1,1,2,2,2];        //各關過關需要的鑽石數量
let codeOver = 0;           //程式執行狀態。 0:尚未執行、1:正在執行、2:執行完畢、3:???
let alpha0 = 1;             //角色0 的透明度。 ！！過於簡略！

//var nowx;
//var nowy;
//var move;       //正在移動中
//var face;       //面向哪個方向。

var stage;//用來存放地圖關卡json資料
var stageNum = 0;   //目前關卡代號
//var stageFood=[];
var stageObject=[];
var stageGround=[];
let jsonfile="pic/11.json";           //???

let url0 = location.href;
      console.log(url0);
		//再來用去尋找網址列中是否有資料傳遞(QueryString)
    if( url0.indexOf('?')!=-1){                 //-1 是啥意思？？
		    //之後去分割字串把分割後的字串放進陣列中
        let ary2 = url0.split('?');
        
        jsonfile = "pic/" + ary2[1].substr(-2) + ".json";       //倒數兩個字
        stageNum = Number(ary2[1].substr(-2))-10;                  //字串轉成數字
        console.log(jsonfile);console.log(stageNum);
    }
    
            //var mJson=$.ajax({url:"pic/0-99.json",async:false});
    $.getJSON(jsonfile ,function(json){                             //這裡重要
        stage =  json;
        //console.log(json.layers[1]);
    });
   

function Player_(x,y,face,move){              //定義Player物件
    
    this.nowx = x;
    this.nowy = y;
    //var ff = ["right0", "up0", "left0", "down0"];
    this.face = face;                   //0:右、1：上、2：左、3：下 
    this.move = move;                   //移動狀態。 -1：靜止
    
    this.role ;
    this.die;                           //死亡狀態：0:活者、1:正在死亡、2:第2種死法、10:已死亡
}

let player=[];              
                    
player[0] = new Player_(2,2,0,-1);                //應該依目前關卡而設定：位置、方向
player[1] = new Player_(2,7,0,-1);                //????

let music;
let sound_get;                      //取得鑽石音效
let sound_error;                    //死亡音效
let sound_error2;                    //死亡音效2
let sound_success;                  //過關音效

function preload() {
  this.load.image("tilesimg", "pic/0-99-2.png");
  //this.load.spritesheet("hero", "dude.png", { frameWidth: 32, frameHeight: 48 });
  //this.load.spritesheet("hero", "Charas14.png", { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet("gini", "pic/190.png", { frameWidth: 48, frameHeight: 48 });
      //this.load.spritesheet("gini1", "pic/pacman242.png", { frameWidth: 48, frameHeight: 48 });
  //this.load.spritesheet("hero", "Charas144.png", 32, 48 );
  this.load.tilemapTiledJSON("mapjson",jsonfile);
    
  //this.load.image('backpic', 'pic/backpic02.png');      //背景圖
    //consol.log(mapjson);
    
    this.load.audio('bgmusic', 'sound/2005rhythm1.mp3');
    //this.load.audio('bgmusic', 'sound/sfx_sounds_impact10.wav');
    this.load.audio('getDiamond', 'sound/Big Egg collect 1.wav');
    this.load.audio('sounderror', 'sound/freesound_8-bit-death-sound.wav');
    this.load.audio('sounderror2', 'sound/freesound_autistic-lucario_error.wav');
    this.load.audio('soundsuccess', 'sound/freesound_success-1.wav');
}

let s;
var fff = ["right0", "up0", "left0", "down0"];

function create() {
    //s = this.add.tileSprite(-120, 0, 600, 600, 'backpic');    //背景圖設置
    //s.setOrigin(0, 0);                                        //背景圖設置
    //console.log(stage.xx);       //放到creat裡試試？
    player[0].nowx=stage.xx;                //在關卡地圖的json裡面自行加上主角的位置和方向
    player[0].nowy=stage.yy;
    player[0].face=stage.ff;
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
  
  let tiles = map.addTilesetImage("0-99","tilesimg");                   //0-99 名稱要和Tiled json圖塊集名稱一樣
  //const layer = map.createStaticLayer(0, tiles, 0, 0);
  //foodlayer = map.createDynamicLayer("object", tiles, 0, 0);              //圖層名稱  
  let numlayer = map.createStaticLayer("ground", tiles, 0, 0);            //圖層名稱
  objectLayer = map.createDynamicLayer("object", tiles, 0, 0);              //圖層名稱
  //layer = map.createLayer(tiles);
  //layer.resizeWorld();
    
    
  
  //產生玩家角色  
  player[0].role = this.add.sprite(player[0].nowx*48, player[0].nowy*48, "gini").setOrigin(0,0);
    player[0].die = 0;
    //this.add.image(0, 0, 'sky').setOrigin(0, 0)
 //   player[1].role = this.add.sprite(player[1].nowx*48, player[1].nowy*48, "gini1").setOrigin(0,0);
  //nowx = 2;
  //nowy = 2;
  //move = -1;
  //player.animations.add('walk', [0, 1, 2, 1]);
  //player.animations.play('walk', 10, true);
    
    //角色0 朝四個方向的動畫
  this.anims.create({
    key: 'left0',
    frames: this.anims.generateFrameNumbers('gini', { start: 4, end: 7 }),
    frameRate: 4,
    repeat: -1
  });
  this.anims.create({
    key: 'right0',
    frames: this.anims.generateFrameNumbers('gini', { start: 8, end: 11 }),
    frameRate: 4,
    repeat: -1
  });
  this.anims.create({
    key: 'up0',
    frames: this.anims.generateFrameNumbers('gini', { start: 12, end: 15 }),
    frameRate: 4,
    repeat: -1
  });
  this.anims.create({
    key: 'down0',
    frames: this.anims.generateFrameNumbers('gini', { start: 0, end: 3 }),
    frameRate: 4,
    repeat: -1
  });
    
  player[0].role.anims.play(fff[player[0].face], true);         //設定一開始面朝的方向
 
/*
    
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
*/

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
  
  keys = this.input.keyboard.addKeys('P,W,A,S,D,R');                //設定可以用的按鍵

  text = this.add.text(16, 16, "hello", { font: "15px Arial", fill: "#bf0044" });//??
  //text.inputEnabled = true;

    
      //  console.log(typeof stage);
    for (i = 0; i < 10; i++) {
        //stageNum[i] = [];
        //stageFood[i] = [];
        stageGround[i] = [];
        stageObject[i] = [];
    }
    for (i=0 ; i<100 ; i++){                            //讀入地圖資料
        //stageNum[ Math.floor(i/10)][i%10] = stage.layers[1].data[i]-1;
        //stageFood[ Math.floor(i/10)][i%10] = stage.layers[0].data[i];
        stageGround[ Math.floor(i/10)][i%10] = stage.layers[0].data[i];
        stageObject[ Math.floor(i/10)][i%10] = stage.layers[1].data[i];
        //stage0[0][i] = i;
    }
    console.log(stageGround); console.log(stageObject);
    
    
    music = this.sound.add('bgmusic');
    sound_get = this.sound.add('getDiamond');
    sound_error = this.sound.add('sounderror');
    sound_error2 = this.sound.add('sounderror2');
    sound_success = this.sound.add('soundsuccess');
    //music.play();
    //music.onDecoded.add(start, this);     //可能已不支援舊語法
    //function start() {
    //    music.fadeIn(4000);
    //}

}
            //update ==========================================
function update(time, delta) {
  // Apply the controls to the camera each update tick of the game
  controls.update(delta);

  //if(s.x>-5){s.x=-120;} else{s.x+=0.5}          //控制背景移動
    
  if (keys.P.isDown){
    foodlayer.fill(0, 1, 1, 2, 2);              //?????
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
       //music.play();         //從頭開始播放音檔
    //music.volume = 0;
     music.stop();
      console.log("stop music");
      //player.x-=18/delta;
    //player.setVelocityX(-16);
    //move_left();
    //player.anims.play('left', true);
  }
  if (keys.D.isDown)
  {
      music.play();
    //player.x+=12/delta;
    //player.anims.play('right', true);
    //move_right();
  }
  if (keys.W.isDown)
  {
      alpha0 -= 0.7/delta;
    player[0].role.setAlpha(alpha0);
    //move_up();
    //player.y-=18/delta;
    //player.anims.play('up', true);
  }
  if (keys.S.isDown)
  {
      console.log(delta);
    //move_down();
    //player.y+=18/delta;
    //player.anims.play('down', true);
  }

    //if(player[0].move != -1){                     //判斷是否在移動中
      move_(0,delta);
    //}
  // move_(1,delta); 
  
    if(player[0].die == 1){
        role_fadeout(player[0].role,delta);
    }

    text.setText("Tile X: " + Math.floor(player[0].role.x/48) +" Y: " + Math.floor(player[0].role.y/48));
    //text ='Tile X: ' + player.x;
    
    if((codeOver == 2) && (diamondNum < diamondNeed[stageNum])){                   //程式執行結束，且未收集到足夠的鑽石
        codeOver = 3;
        console.log("die 3");
        role_die(2);
    }
}
// update 結束


function move_(n,delta){                   //n 角色0或1
    
  if(player[n].move != -1){                     //判斷是否在移動中
    if(player[n].move == 0){                    //判斷是否方向向右
        if( player[n].role.x < (player[n].nowx + 1) * 48){
            player[n].role.x+= 0.09*delta;             //????player[n].role.x+=24/delta;
        }else{
            player[n].role.x = (player[n].nowx + 1) * 48;
            player[n].nowx++;
            player[n].move= -1;
          //foodlayer.fill(0, player[n].nowx, player[n].nowy, 1, 1);      //食物消失
            if(stageObject[player[n].nowy][player[n].nowx]==61){
                get_object(61);
                console.log("get obj");                             //得到物品
            }
            else if(stageGround[player[n].nowy][player[n].nowx]==0){
                role_die(1);
                console.log("die");
            }
            
        }
    }

    if(player[n].move == 1){                    //判斷是否方向向上
      if( player[n].role.y > (player[n].nowy - 1) * 48){
        player[n].role.y-= 0.09*delta;     //player[n].role.y-=24/delta;
      }else{
            player[n].role.y = (player[n].nowy - 1) * 48;
            player[n].nowy--;
            player[n].move= -1;
              //foodlayer.fill(0, player[n].nowx, player[n].nowy, 1, 1);
            if(stageObject[player[n].nowy][player[n].nowx]==61){
                get_object(61);
                console.log("get obj");                             //得到物品
            }
            if(stageGround[player[n].nowy][player[n].nowx]==0){
                role_die(1);
                console.log("die");
            }
            
      }
    }

    if(player[n].move == 2){                    //判斷是否方向向左
      if( player[n].role.x > (player[n].nowx - 1) * 48){
        player[n].role.x-= 0.09*delta;     //player[n].role.x-=24/delta;
      }else{
            player[n].role.x = (player[n].nowx - 1) * 48;
            player[n].nowx--;
            player[n].move= -1;
              //foodlayer.fill(0, player[n].nowx, player[n].nowy, 1, 1);
            if(stageObject[player[n].nowy][player[n].nowx]==61){
                get_object(61);
                console.log("get obj");
            }
            if(stageGround[player[n].nowy][player[n].nowx]==0){
                role_die(1);
                console.log("die");
            }
            
      }
    }

    if(player[n].move == 3){                    //判斷是否方向向下
        if( player[n].role.y < (player[n].nowy + 1) * 48){
            player[n].role.y+=0.09*delta;     //player[n].role.y+=24/delta;
        }else{
            player[n].role.y = (player[n].nowy + 1) * 48;
            player[n].nowy++;
            player[n].move= -1;
              //foodlayer.fill(0, player[n].nowx, player[n].nowy, 1, 1);
          console.log(codeOver);
            if(stageObject[player[n].nowy][player[n].nowx]==61){
                get_object(61);
                console.log("get obj");
            }
            if(stageGround[player[n].nowy][player[n].nowx]==0){
                role_die(1);
                console.log("die");
            }
            
        }
    }

    if(player[n].move == -2){               //角色轉向，設定角色動畫
        if(player[n].face == 0){ player[n].role.anims.play('right'+n, true); }
        if(player[n].face == 1){ player[n].role.anims.play('up'+n, true); }
        if(player[n].face == 2){ player[n].role.anims.play('left'+n, true); }
        if(player[n].face == 3){ player[n].role.anims.play('down'+n, true); }
        
        player[n].move= -1;
        
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


function move_forward(n) {               //前進

  //！！應先判斷前方是否有路，再做移動
    
  if (player[n].face == 0){
      move_right(n);
      if (stageGround[player[n].nowy][player[n].nowx+1]==0){return "exit";}        //程序中止
  }
  if (player[n].face == 1){
      move_up(n);
      if (stageGround[player[n].nowy-1][player[n].nowx]==0){return "exit";}        
  }
  if (player[n].face == 2){
      move_left(n);
      if (stageGround[player[n].nowy][player[n].nowx-1]==0){return "exit";}        
  }
  if (player[n].face == 3){
      move_down(n);
      if (stageGround[player[n].nowy+1][player[n].nowx]==0){return "exit";}        
  }
    
}

function move_back(n){                  //倒退
    
      //！！應先判斷後方是否有路，再做移動
    
  if (player[n].face == 2){
      back_right(n);
      if (stageGround[player[n].nowy][player[n].nowx+1]==0){return "exit";}        //程序中止
  }
  if (player[n].face == 3){
      back_up(n);
      if (stageGround[player[n].nowy-1][player[n].nowx]==0){return "exit";}        
  }
  if (player[n].face == 0){
      back_left(n);
      if (stageGround[player[n].nowy][player[n].nowx-1]==0){return "exit";}        
  }
  if (player[n].face == 1){
      back_down(n);
      if (stageGround[player[n].nowy+1][player[n].nowx]==0){return "exit";}        
  }

}

function back_right(n) {
  player[n].role.anims.play('left'+n, true);
  
  if(player[n].move == -1){
    player[n].move = 0;       //移動方向為右
    player[n].face = 2;
  }
}
function back_left(n) {
  player[n].role.anims.play('right'+n, true);
  if(player[n].move == -1){
    player[n].move = 2;       //移動方向為左
    player[n].face = 0;
  }
}
function back_up(n) {
  player[n].role.anims.play('down'+n, true);
  if(player[n].move == -1){
    player[n].move = 1;       //移動方向為上
    player[n].face = 3;
  }
}
function back_down(n) {
  player[n].role.anims.play('up'+n, true);
  if(player[n].move == -1){
    player[n].move = 3;       //移動方向為下
    player[n].face = 1;
  }
}



function turn_left(n){
    
    player[n].face = (player[n].face + 1) % 4;
    player[n].move = -2;            //原地轉向
}
function turn_right(n){
    
    player[n].face = (player[n].face + 3) % 4;
    player[n].move = -2;            //原地轉向
}


function get_object(num) {              //取得物品(物品代號)
    sound_get.play();
    diamondNum += 1;
    stageObject[player[0].nowy][player[0].nowx] = 0;            //！！先nowy 再nowx
    objectLayer.fill(0,player[0].nowx,player[0].nowy,1,1);      //地圖中的物品消失
    //
    console.log(codeOver);
    //判斷是否符合過關條件
    if(diamondNum == diamondNeed[stageNum]){
        setTimeout('sound_success.play();',1400);

        clearInterval(timer);       //停止計時
        timer = null;               // 將狀態轉為空

        setTimeout(function(){ alert("恭喜您過關了！ \n自動進到下一關！");},2000);
        //var newLink;
        //寫入過關資料
        a = {
            data: '2'+','+ stageNum +','+ '1' +','+ timeCount,       //寫入到工作表的第2列
            sheetUrl: '',  
            sheetTag: '工作表1',
            mode: 3         //寫入模式
        };
        console.log(a);
        $.get('https://script.google.com/macros/s/AKfycbwQX5Xknx6scXF33XpaH81dFvDencOWiq-KmaP7czgHWLJMRkxs/exec', a,function(data){
            console.log(data);          //write ok!
            if(stageNum<10){
                let newLink = url0.substr(0,location.href.length-2) + (Number(url0.substr(-2))+1);    //連向下一關的連結
                setTimeout(function(){ window.location.href = newLink; } ,2500);             //自動連到下一關
            }
        } );
    }
    
    //let newLink = url0.substr(0,location.href.length-2) + (Number(url0.substr(-2))+1);    //連向下一關的連結
    //setTimeout(function(){ window.location.href = newLink; } ,2500);             //自動連到下一關
}


function role_die(num) {              //角色死亡(死法代號)。 1:墜入黑暗、2:執行完畢卻未過關
    if(num==1) {
        sound_error.play();
        player[0].die = 1;          //正在死亡    
    }
    if(num==2) {
        sound_error2.play();
        player[0].die = 2;          //第2種死法
        alert("您的程式有問題！ \n 重新試一次吧！");
        window.location.reload();       //重新整理
    }
}

function role_fadeout(role,delta) {             //角色淡出消失效果
    alpha0 -= 0.7/delta;                        //程式過於簡略，應判斷是哪個角色要淡出，每個角色應有不同的alpha值
    role.setAlpha(alpha0);
    if(alpha0 <=0) {
        player[0].die =10;               //已經死亡
        alert("您的程式有問題！ \n 重新試一次吧！");
        window.location.reload();       //重新整理
        //window.location.href = url0.substr(0,location.href.length-2) + (Number(url0.substr(-2))+1);    //連向下一關
    } 
}
/*
let eatNum = 0;         //已吃掉的食物量
function eat(num000,N) {                        //吃數字或字母(要吃掉的數字,第N個角色)

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
*/
