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
let controls;                           //控制攝影機的按鍵????
var keys;                           //可以用的按鍵設置
//var level;                          //???
var map;                            //???
var gndLayer;
var objectLayer;
var textLayer=[];
//var layer;                      //????
var text;
let diamondNum = 0;         //取得的鑽石數量
let diamondNeed = [0,1,1,1,1,1,1,1,2,2,2];        //各關過關需要的鑽石數量
let maxblock = [10,2,4,6,6,8,11,2,3,6,6,10];        //每關可使用的最大方塊數量
let codeOver = 0;           //程式執行狀態。 0:尚未執行、1:正在執行、2:執行完畢、3:???
let alpha0 = 1;             //角色0 的透明度。 ！！過於簡略！

//var nowx;
//var nowy;
//var move;       //正在移動中
//var face;       //面向哪個方向。

var stage;//用來存放地圖關卡json資料
var stageNum = 0;   //目前關卡代號   範圍從 1~10
var stageText=[];
var stageObject=[];
var stageGround=[];
let jsonfile="json/0-199.json";           //???
let url4 = location.href;
let ary4 =[];
    ary4 = url4.split("?");

    if( url4.indexOf('?')!=-1){                 //-1 是啥意思？？
	
        jsonfile = "json/1" + ary4[1].substr(-1) + ".json";       //倒數兩個字
        stageNum = Number(ary4[1].substr(2,1))+1;                  //字串轉成數字 ，共有 1 到 10 關
        console.log(jsonfile);console.log(stageNum);
    }
    else{
        jsonfile = "json/0-199.json";                   //???
    }
    
            //var mJson=$.ajax({url:"json/0-99.json",async:false});
    $.getJSON(jsonfile ,function(json){                             //這裡重要
        stage =  json;
        //console.log(json.layers[1]);
    });
   

function Player_(x,y,face,move){              //定義Player物件
    
    this.nowx = x;
    this.nowy = y;
    //var ff = ["right0", "up0", "left0", "down0"];
    this.face = face;                   //面向 0:右、1：上、2：左、3：下 
    this.move = move;                   //移動狀態。 -1：靜止
    
    this.role ;                         //????sprite物件……
    this.die;                           //死亡狀態：0:活者、1:正在死亡、2:第2種死法、10:已死亡
}

let npc;//=[];
let player=[];
                    
player[0] = new Player_(2,2,0,-1);                //應該依目前關卡而設定：位置、方向
player[1] = new Player_(2,7,0,-1);                //????

//let music=[];                       //背景音樂
//let bgmIndex = 0;                   //背景音樂曲目索引
let sound_get;                      //取得鑽石音效
let sound_bump;                     //取得撞路障音效
let sound_error;                    //死亡音效
let sound_error2;                   //死亡音效2
let sound_success;                  //過關音效
let sound_clear;                    //數字消失音效
let foot_step;                      //走路音效

function preload() {
  this.load.image("tilesimg", "/pic/0-199.png");                                        //瓦片集
  //  this.load.image("dialog", "/pic/dialogIcons.png");                               //對話圖示
    
  //this.load.spritesheet("hero", "dude.png", { frameWidth: 32, frameHeight: 48 });
  //this.load.spritesheet("hero", "Charas14.png", { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet("gini", "../Character/"+ ary4[2] +"2.png", { frameWidth: 48, frameHeight: 48 });   //角色圖
   // this.load.spritesheet("npc0", "pic/yuhinamv128.png", { frameWidth: 45, frameHeight: 45 });       //老頭角色圖
      //this.load.spritesheet("gini1", "pic/pacman242.png", { frameWidth: 48, frameHeight: 48 });
  //this.load.spritesheet("hero", "Charas144.png", 32, 48 );
  this.load.tilemapTiledJSON("mapjson",jsonfile);
    
  //this.load.image('backpic', 'pic/backpic02.png');      //背景圖
    //consol.log(mapjson);
    
    //this.load.audio('bgmusic', '/sound/2005rhythm1.mp3');
    //this.load.audio('bgmusic2', '/sound/song18_use.mp3');
    this.load.audio('getDiamond', '/sound/Big Egg collect 1.wav');
    this.load.audio('soundbump', '/sound/Flop_Down.wav');
    this.load.audio('sounderror', '/sound/freesound_8-bit-death-sound.wav');
    this.load.audio('sounderror2', '/sound/freesound_autistic-lucario_error.wav');
    this.load.audio('soundsuccess', '/sound/freesound_success-1.wav');
    this.load.audio('soundclear', '/sound/maoudamashii_wind02.ogg');
    this.load.audio('footstep', '/sound/freesound_by_inspectorj_running-snow.wav');
}

//let s;
var fff = ["right0", "up0", "left0", "down0"];
var camara0;
let data_Design = [];
let lineN=[];           //畫格線
var marker;             //畫正方形

function create() {
    
    //bgmIndex = Math.floor( Math.random()*2 );
    //s = this.add.tileSprite(-120, 0, 600, 600, 'backpic');    //背景圖設置
    //s.setOrigin(0, 0);                                        //背景圖設置
    //console.log(stage.xx);       //放到creat裡試試？
    player[0].nowx=stage.xx;                //在關卡地圖的json裡面自行加上主角的位置和方向
    player[0].nowy=stage.yy;
    player[0].face=stage.ff;

    
  // When loading from an array, make sure to specify the tileWidth and tileHeight
  //map = this.add.tilemap({ data: level, tileWidth: 48, tileHeight: 48 });
  
  map= this.add.tilemap("mapjson");
  
  let tiles = map.addTilesetImage("0-199","tilesimg");                   //0-199 名稱要和Tiled json圖塊集名稱一樣
  
  //gndLayer = map.createDynamicLayer("ground", tiles, 0, 0);            //圖層名稱
  gndLayer = map.createDynamicLayer("ground", tiles, 0, 0);              //圖層名稱
  objectLayer = map.createDynamicLayer("object", tiles, 0, 0);              //圖層名稱  
  //layer = map.createLayer(tiles);
  this.input.setDefaultCursor('url(/pic/W_Throw002.png), pointer');
    
        //music[0] = this.sound.add('bgmusic');
    //music[1] = this.sound.add('bgmusic2');
    sound_get = this.sound.add('getDiamond');
    sound_bump =  this.sound.add('soundbump');
    sound_error = this.sound.add('sounderror');
    sound_error2 = this.sound.add('sounderror2');
    sound_success = this.sound.add('soundsuccess');
    foot_step = this.sound.add('footstep');
    //music.play();
    //music.onDecoded.add(start, this);     //可能已不支援舊語法
    //function start() {
    //    music.fadeIn(4000);
    //}
  
  //產生玩家角色                                  //-1??
  player[0].role = this.add.sprite((player[0].nowx-1)*48, (player[0].nowy-1)*48, "gini").setOrigin(0,0);
    player[0].die = 0;
    
    
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

  camera0 = this.cameras.main;

  const cursors = this.input.keyboard.createCursorKeys();               //???
  controls = new Phaser.Cameras.Controls.FixedKeyControl({
    camera: camera0,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    left: cursors.left,
    speed: 0.2
  });

  camera0.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
   camera0.startFollow(player[0].role, true, 0.08, 0.08);                //攝影機跟隨角色
   // console.log(0.09);
    
  keys = this.input.keyboard.addKeys('P,W,A,S,D,R');                //設定可以用的按鍵

  //text = this.add.text(16, 13, "hello", { font: "15px Arial", fill: "#bf0044" });//??
  //text.inputEnabled = true;

      //  console.log(typeof stage);
    for (i = 0; i < 11; i++) {                      //先宣告空陣列！       // 11 ??
        //stageNum[i] = [];
        //stageFood[i] = [];
        stageGround[i] = [];
        stageObject[i] = [];
        stageText[i] = [];
        textLayer[i] = [];
    } 
    
    for (var i=0 ; i<100 ; i++){
        var xt = i%10+1;
        var yt = Math.floor(i/10)+1;
        
        textLayer[ xt ][ yt ] = this.add.text(-31+xt*48, -25+yt*48, "", { font: "20px Arial Black", fill: "#fff" }).setStroke(0x000000, 3);             //0x000000 沒作用.. ??
        
        textLayer[ xt ][ yt ].alpha = 0.6;
        //text.setAlign('center');
    }
    
    
    let readRow0 = Math.floor(Number(ary4[1].substr(-2))-1)*100 + Number(ary4[1].substr(1,1))* 10+7;	//?? 0619修正
    let bbb = {
        data: Number(ary4[1].substr(2,1))+1,           //從第 x欄開始讀
        readRow: readRow0,                              //放提示的列
        sheetUrl: '',
        sheetTag: Math.floor(Number(ary4[1].substr(-2))/10) +1,        //
        mode: 2.5         //讀取提示模式
    };
    $.get('https://script.google.com/macros/s/AKfycby_1_F9fcOzOB3qFFuFTlNRVfbT5-VKd4d5_wGKB8GFbD843W9F/exec', bbb,     function(tipData){                       
            tipsMsg[stageNum] = tipData;          //???
            //console.log(tipsMsg[stageNum]+'abc');
    });
    
        readRow0 = Math.floor(Number(ary4[1].substr(-2))-1)*100 + Number(ary4[1].substr(1,1))* 10+3;	//?? 0619修正
        let aaa = {
            data: Number(ary4[1].substr(2,1))+1,           //從第 x欄開始讀
            readRow: readRow0,
            sheetUrl: '',
            sheetTag: Math.floor(Number(ary4[1].substr(-2))/10) +1,        //
            mode: 2.2         //讀取模式
        };
            //$('#overlay').show();
            //console.log(a);
            $.get('https://script.google.com/macros/s/AKfycby_1_F9fcOzOB3qFFuFTlNRVfbT5-VKd4d5_wGKB8GFbD843W9F/exec', aaa,
                function(data){
                    console.log(data); 
                    data_Design = data.split(',');
                
//                    $('#overlay').html('<br>讀取完成<br>請按一下滑鼠');       //alert(0);
//                    $('#overlay').click(  function(){                   //這麼做是為了避免自動播放音樂會產生錯誤
//                        $('#overlay').hide();   
//                    } ); 
                    for (i=0 ; i<100 ; i++){                            //讀入地圖資料
                        //stageGround[ Math.floor(i/10)+1][i%10+1] = stage.layers[0].data[i];             //+1 ??
                        //stageObject[ Math.floor(i/10)+1][i%10+1] = stage.layers[1].data[i];             //+1 ??
                        stageText[i%10+1][ Math.floor(i/10)+1 ] = Number(data_Design[i]);
                        stageGround[ Math.floor(i/10)+1][i%10+1] = Number(data_Design[i+100]);
                        stageObject[ Math.floor(i/10)+1][i%10+1] = Number(data_Design[i+200]);
                        
                        if(data_Design[i] != -1){
                            if(data_Design[i] < 10){
                                textLayer[i%10+1][Math.floor(i/10)+1].text = " "+ Number(data_Design[i]); 
                            }else{
                                textLayer[i%10+1][Math.floor(i/10)+1].text = Number(data_Design[i]);      //??
                            }
                            
                        }
                        gndLayer.fill(Number(data_Design[i+100]) ,i%10 ,Math.floor(i/10) ,1,1);      //更新地圖
                        objectLayer.fill(Number(data_Design[i+200]) ,i%10 ,Math.floor(i/10) ,1,1);  //更新地圖物品
                    }
                    stage.xx= data_Design[300];             //這三行不太需要…
                    stage.yy= data_Design[301];
                    stage.ff= data_Design[302];
                    diamondNeed[stageNum]= Number(data_Design[303]);
                    maxblock[stageNum]= Number(data_Design[304]);
                    //$('#needDim').val(diamondNeed[stageNum]);
                    $('#maxB').val(maxblock[stageNum]);
                    document.getElementById('needDim2').innerHTML= diamondNeed[stageNum];
                
                    player[0].nowx= Number(data_Design[300]);       //Number  非常重要！！！
                    player[0].nowy= Number(data_Design[301]);
                    player[0].face= Number(data_Design[302]);       //console.log(player[0].face);
                   
                    player[0].role.x = (player[0].nowx - 1) * 48;
                    player[0].role.y = (player[0].nowy - 1) * 48;
                    player[0].role.anims.play(fff[player[0].face], true);       //
                
                    toolsAry = data_Design.slice(305, data_Design.length );       //截取 從205到最後
                    toolAryToXML();
                    document.getElementById('toolbox'+(stageNum+10) ).innerHTML = toolsXML;
                    gen_workspace('toolbox'+(stageNum+10));		 //產生工作區????
					workspace.addChangeListener(onchange);
                    
					setTimeout(BlocklyStorage.restoreBlocks, 0);
		
					BlocklyStorage.backupOnUnload();		// 工作區中的初始blocks
					
                    
                    var idd = document.getElementsByClassName('chek');              //取得全部的核取方塊元素
                    for (i=0 ; i<toolsAry.length ; i++){
                        for (var k = 0; k < idd.length; k++  ){
                            if( idd[k].value == toolsAry[i]){
                                idd[k].checked = true;                        //設為已核取
                                break;
                            }
                        }
                    }
                    
                }
            );
    
    //console.log(stageGround); console.log(stageObject);
    for(i=1;i<10;i++){
        lineN[i-1] = this.add.line(48*i, 240, 0, 480, 0, 0, 0x550000 );
        //lineN[i-1].ScaleX = 0.5;            //???
        lineN[i-1].alpha = 0.3;
        lineN[i+8] = this.add.line(240, 48*i, 0, 0, 480, 0, 0x550000 );
        lineN[i+8].alpha = 0.3;
    }
    drawLine();
    
}

            //update ==========================================
function update(time, delta) {
    // Apply the controls to the camera each update tick of the game
    controls.update(delta);
    
    if(delta >=34){
                     //????
        //if(codeOver == 0){alert("警告！遊戲執行過慢...！ \n delta ="+delta);}
        console.log("警告！遊戲執行過慢...！ \n delta ="+delta);
    }
    
  //if(s.x>-5){s.x=-120;} else{s.x+=0.5}          //控制背景移動
    
    if (keys.P.isDown){
     gndLayer.fill(92 ,1 ,1 ,1,1);    
        //console.log('aaaaa');
    }
    else{
       // map.fill(1, 1, 1, 2, 2);
    }
  
    if (keys.R.isDown){
      
        // if(s.x>116){s.x=0;} else{s.x+=0.5}   //console.log(s);
        sound_bump.play();
        camera0.shake(160,0.008);                      //指定晃動時間 和 強度
      
    }

    if (keys.A.isDown)
    {
       //music.play();         //從頭開始播放音檔
        //music.volume = 0;
        bgmusic[0].volume=0;//stop();
        bgmusic[1].volume=0;
        console.log("mute music");
    }
    if (keys.D.isDown)
    {
     
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
                 //????
    }

    //if(player[0].move != -1){                     //判斷是否在移動中
    move_(0,delta);                         //角色0
    //}
    // move_(1,delta); 
  
    if(player[0].die == 1){
        role_fadeout(player[0].role,delta);
    }
    else if((codeOver == 2) && (diamondNum < diamondNeed[stageNum])){          //程式執行結束，且未收集到足夠的鑽石
        codeOver = 3;
        console.log("die 3");
        if(player[0].die != 10){    role_die(2);    }                   //已經以其它死法完成死亡
    }

    //text.setText("Tile X: " + Math.floor(player[0].role.x/48+1) +" Y: " + Math.floor(player[0].role.y/48+1));   //+1??
    //text ='Tile X: ' + player.x;    
    
    
//    if (this.input.manager.activePointer.isDown)
//    {
//        if( selectedTile >160){
//            objectLayer.fill( selectedTile ,pointerTileX ,pointerTileY ,1,1);
//            //console.log(typeof(pointerTileX));console.log(typeof(pointerTileY));
//            console.log(stageObject[YY][XX] != selectedTile);
//        }else{
//            gndLayer.fill( selectedTile, pointerTileX, pointerTileY ,1,1);      //更新地圖
//            //stageGround[pointerTileY+1][pointerTileX+1] = selectedTile;
//        }
//        if( selectedTile ==0){
//            objectLayer.fill( selectedTile ,pointerTileX ,pointerTileY ,1,1);  //更新地圖物品
//            //stageObject[pointerTileY+1][pointerTileX+1] = selectedTile;
//        }
//    }
}
// update 結束


function move_(n,delta){                   //移動或轉向 都會呯叫此函數做處理    //n 角色0或1
    
  if(player[n].move != -1){                     //判斷是否在移動中
      
    if(player[n].move == 0){                    //判斷是否方向向右
        if( player[n].role.x < (player[n].nowx-1 + 1) * 48){
            player[n].role.x+= 2;//0.1*delta;             //????player[n].role.x+=24/delta;
        }else{
            player[n].role.x = (player[n].nowx-1 + 1) * 48;
            player[n].nowx++;
            player[n].move= -1;
            
            //foodlayer.fill(0, player[n].nowx, player[n].nowy, 1, 1);      //食物消失
            nowGroObj( stageGround[player[n].nowy][player[n].nowx] ,stageObject[player[n].nowy][player[n].nowx]); 
        }
    }

    if(player[n].move == 1){                    //判斷是否方向向上
      if( player[n].role.y > (player[n].nowy-1 - 1) * 48){
        player[n].role.y-= 2;//0.1*delta;     //player[n].role.y-=24/delta;
      }else{
            player[n].role.y = (player[n].nowy-1 - 1) * 48;
            player[n].nowy--;
            player[n].move= -1;
          
            //foodlayer.fill(0, player[n].nowx, player[n].nowy, 1, 1);
            nowGroObj( stageGround[player[n].nowy][player[n].nowx] ,stageObject[player[n].nowy][player[n].nowx]);
      }
    }

    if(player[n].move == 2){                    //判斷是否方向向左
      if( player[n].role.x > (player[n].nowx-1 - 1) * 48){
        player[n].role.x-= 2;//0.1*delta;     //player[n].role.x-=24/delta;
      }else{
            player[n].role.x = (player[n].nowx-1 - 1) * 48;
            player[n].nowx--;
            player[n].move= -1;
            
            nowGroObj( stageGround[player[n].nowy][player[n].nowx] ,stageObject[player[n].nowy][player[n].nowx]);
      }
    }

    if(player[n].move == 3){                    //判斷是否方向向下
        if( player[n].role.y < (player[n].nowy-1 + 1) * 48){
            player[n].role.y+= 2;//0.1*delta;     //player[n].role.y+=24/delta;
           
        }else{
            player[n].role.y = (player[n].nowy-1 + 1) * 48;
            player[n].nowy++;
            player[n].move= -1;             //停止移動
            
            console.log(codeOver);            
            nowGroObj( stageGround[player[n].nowy][player[n].nowx] ,stageObject[player[n].nowy][player[n].nowx]);
        }
    }

    if(player[n].move == -2){               //角色轉向(左或右)，設定角色動畫
        if(player[n].face == 0){ player[n].role.anims.play('right'+n, true); }
        if(player[n].face == 1){ player[n].role.anims.play('up'+n, true); }
        if(player[n].face == 2){ player[n].role.anims.play('left'+n, true); }
        if(player[n].face == 3){ player[n].role.anims.play('down'+n, true); }
        
        foot_step.play();
        player[n].move= -1;
        
    }
  }
}

//移動完成後，依 所站的位置 、位置上的物品，再做後續處理
function nowGroObj(gro,obj) {
    if(obj==203){                   //樹枝   //整段程式要改！！
        get_object(203);
        console.log("get obj");
    }
    if(obj==231){                   //掉入巨坑          //if(gro==0){
        role_die(1);
        console.log("die");
    }
    
}

//
function fillTiles() {              //???
    //map.fill(31, layer.getTileX(player.x), layer.getTileY(player.y), 1, 1);
    map.fill(31, Math.floor(player.role.x/48), Math.floor(player.role.y/48), 1, 1);
}


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

    if(diamondNum == diamondNeed[stageNum]){return "exit";}        //已經過關，程序中止  timer == null;
    foot_step.play();
    
  //！！應先判斷前方是否有路，再做移動
    let nextGround = 0;         //目標地塊的編號
    let nextObject = 0;         //目標地塊上的物品編號
    
    if (player[n].face == 0){
        nextGround = stageGround[player[n].nowy][player[n].nowx+1];     
        nextObject = stageObject[player[n].nowy][player[n].nowx+1];
    }
    if (player[n].face == 1){
        nextGround = stageGround[player[n].nowy-1][player[n].nowx];
        nextObject = stageObject[player[n].nowy-1][player[n].nowx];
    }
    if (player[n].face == 2){
        nextGround = stageGround[player[n].nowy][player[n].nowx-1];
        nextObject = stageObject[player[n].nowy][player[n].nowx-1];
    }
    if (player[n].face == 3){
        nextGround = stageGround[player[n].nowy+1][player[n].nowx];
        nextObject = stageObject[player[n].nowy+1][player[n].nowx];
    }
    
        
    if( !((nextGround>=1)&&(nextGround<=130)) ){
        sound_bump.play();
        camera0.shake(160,0.008);                      //指定晃動時間 和 強度
        //return "exit";
    }else if(nextObject>=232){      //( ((nextGround>=131)&&(nextGround<=160))||(nextObject>=232) ){
        sound_bump.play();
        camera0.shake(160,0.008);                      //指定晃動時間 和 強度
        //return "exit";
    }else{
        if (player[n].face == 0){
            move_right(n);
        }
        if (player[n].face == 1){
            move_up(n);
        }
        if (player[n].face == 2){
            move_left(n);
        }
        if (player[n].face == 3){
            move_down(n);       
        }
        if (nextObject==231) {return "exit";}              //掉入巨坑 
    }
}

function move_back(n){                  //倒退
    
    if(diamondNum == diamondNeed[stageNum]){return "exit";}        //已經過關，程序中止
    foot_step.play();
    //！！應先判斷後方是否有路，再做移動
    
    let nextGround = 0;         //目標地塊的編號
    let nextObject = 0;         //目標地塊上的物品編號
    
    if (player[n].face == 0){
        nextGround = stageGround[player[n].nowy][player[n].nowx-1];     
        nextObject = stageObject[player[n].nowy][player[n].nowx-1];
    }
    if (player[n].face == 1){
        nextGround = stageGround[player[n].nowy+1][player[n].nowx];
        nextObject = stageObject[player[n].nowy+1][player[n].nowx];
    }
    if (player[n].face == 2){
        nextGround = stageGround[player[n].nowy][player[n].nowx+1];
        nextObject = stageObject[player[n].nowy][player[n].nowx+1];
    }
    if (player[n].face == 3){
        nextGround = stageGround[player[n].nowy-1][player[n].nowx];
        nextObject = stageObject[player[n].nowy-1][player[n].nowx];
    }   
    
    
    if( !((nextGround>=1)&&(nextGround<=130)) ){
        sound_bump.play();
        camera0.shake(160,0.008);                      //指定晃動時間 和 強度
        //return "exit";
    }else if(nextObject>=232){      //232以上都不可行走( ((nextGround>=131)&&(nextGround<=160))||(nextObject>=232) ){
        sound_bump.play();
        camera0.shake(160,0.008);                      //指定晃動時間 和 強度
        //return "exit";
    }else{
        if (player[n].face == 2){
            back_right(n);
        }
        if (player[n].face == 3){
            back_up(n);
        }
        if (player[n].face == 0){
            back_left(n);
        }
        if (player[n].face == 1){
            back_down(n);
        }
        if (nextObject==231) {return "exit";}              //掉入巨坑
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
    if(num==203){                   //這裡有問題！！
        diamondNum += 1;
        document.getElementById('getDim').innerHTML= diamondNum;
    }                
    
    stageObject[player[0].nowy][player[0].nowx] = 0;            //！！先nowy 再nowx
    objectLayer.fill(0,player[0].nowx-1,player[0].nowy-1,1,1);      //地圖中的物品消失      -1??
    //
    console.log(codeOver);
    //判斷是否符合過關條件
    if(diamondNum == diamondNeed[stageNum]){
        setTimeout('sound_success.play();',1200);

        clearInterval(timer);       //停止計時
        timer = null;               // 將狀態轉為空
        
        //timeCount += Number(data_1[ stageNum+10-1 ]);            //加上上次花的時間
        //let strWin ="<br>恭喜您過關了！ <br>共花費 " +(timeCount/10)+ "秒<br>將自動進到下一關！";
        let strWin ="<br>恭喜您過關了！ <br>您花費了 " +(timeCount/10)+ "秒，<br>將自動回到選單！";
        console.log(timeCount/10);

        
        setTimeout( function(){
            $('#overlayEnd').html(strWin + '<div id="gifdiv"><img src="../../pic/user16.gif" /></div>');
            document.getElementById('overlayEnd').title = '';
            //$('#overlayEnd').html('<br>恭喜您過關了！ <br>共花費 秒<br>將自動進到下一關！');
            $('#overlayEnd').show();
        },2000);     //????
        
        
        setTimeout(function(){              //這裡連結要改！！
            window.location.href = "dareMenu.html?" + ary4[2] + "?" + ary4[3] + "?" + ary4[1].substr(-3);    
        } ,5000);   
            
    }
    
}

function something_ahead(n,option){           //前方是否有………
    
    let ground,obj;
    let x = player[n].nowx;
    let y = player[n].nowy;
    if(option=='Lway'){
        if( player[n].face == 3){ x++; }
        if( player[n].face == 0){ y--; }
        if( player[n].face == 1){ x--; }
        if( player[n].face == 2){ y++; }
    }else if(option=='Rway'){
        if( player[n].face == 1){ x++; }
        if( player[n].face == 2){ y--; }
        if( player[n].face == 3){ x--; }
        if( player[n].face == 0){ y++; }        
    }else{
        if( player[n].face == 0){ x++; }
        if( player[n].face == 1){ y--; }
        if( player[n].face == 2){ x--; }
        if( player[n].face == 3){ y++; }
    }
    
    ground = stageGround[y][x];
    obj = stageObject[y][x];
    
    if ((option == 'way')||(option == 'Lway')||(option == 'Rway')){
        if ((ground >= 92 )&&(ground <= 129)&&(obj<233)){           //npc、敵人算沒有路
            if(obj == 231){return false;}                           //前有巨坑算無路
            return true;
        }else{
            return false;
        } 
    }
    if (option == 'tree'){
        if (ground == 131 ){                            //大樹
            return true;
        }else{
            return false;
        } 
    }
    if (option == 'mont'){
        if ( (ground >= 137 )&&(ground <= 150) ){           //山
            return true;
        }else{
            return false;
        } 
    }
}


function role_die(num) {              //角色死亡(死法代號)。 1:墜入黑暗、2:執行完畢卻未過關
    if(num==1) {
        sound_error.play();
        player[0].die = 1;          //正在死亡    
    }
    if(num==2) {
        sound_error2.play();
        player[0].die = 2;          //第2種死法
        //alert("您的程式有問題！ \n 重新試一次吧！");
        $('#overlayEnd').show();
        $('#overlayEnd').click(function(){
            window.location.reload();       //重新整理
        });
    }
}

function role_fadeout(role,delta) {             //角色淡出消失效果
    alpha0 -= 0.7/delta;                        //程式過於簡略，應判斷是哪個角色要淡出，每個角色應有不同的alpha值
    role.setAlpha(alpha0);
    if(alpha0 <=0) {
        player[0].die =10;               //已經死亡
        //alert("您的程式有問題！ \n 重新試一次吧！");
        $('#overlayEnd').show();
        $('#overlayEnd').click(function(){
            window.location.reload();       //重新整理
        });
        //window.location.href = url0.substr(0,location.href.length-2) + (Number(url0.substr(-2))+1);    //連向下一關
    } 
}

function drawLine(){
    for(i=0;i<18;i++){  
        lineN[i].visible= !lineN[i].visible; 
    }
}


//數字羅盤，轉向該數字，以有鑽石203的地方優先
function turnToNum(NN,numXX) {
    if ((stageText[player[NN].nowx+1][player[NN].nowy] == numXX) && (stageObject[player[NN].nowy][player[NN].nowx+1] == 203)){
        player[NN].face = 0;    //turn_right(NN);
    }
    else if ((stageText[player[NN].nowx][player[NN].nowy-1] == numXX) && (stageObject[player[NN].nowy-1][player[NN].nowx] == 203)){
        player[NN].face = 1;    //turn_up(NN);
    }
    else if ((stageText[player[NN].nowx-1][player[NN].nowy] == numXX) && (stageObject[player[NN].nowy][player[NN].nowx-1] == 203)){
        player[NN].face = 2;    //turn_left(NN);
    }
    else if ((stageText[player[NN].nowx][player[NN].nowy+1] == numXX) && (stageObject[player[NN].nowy+1][player[NN].nowx] == 203)){
        player[NN].face = 3;    //turn_down(NN);
    }
    else if ((stageText[player[NN].nowx+1][player[NN].nowy] == numXX)){
        player[NN].face = 0;    //turn_right(NN);
    }
    else if ((stageText[player[NN].nowx][player[NN].nowy-1] == numXX)){
        player[NN].face = 1;    //turn_up(NN);
    }
    else if ((stageText[player[NN].nowx-1][player[NN].nowy] == numXX)){
        player[NN].face = 2;    //turn_left(NN);
    }
    else if ((stageText[player[NN].nowx][player[NN].nowy+1] == numXX)){
        player[NN].face = 3;    //turn_down(NN);
    }else{
        //return;
    }
    
    player[NN].move = -2;            //原地轉向
}

//前往該數字，以有鑽石203的地方優先
function gotoNum(NN,numXX) {
    
    if ((stageText[player[NN].nowx+1][player[NN].nowy] == numXX) && (stageObject[player[NN].nowy][player[NN].nowx+1] == 203)){
        player[NN].face = 0;    //turn_right(NN);
    }
    else if ((stageText[player[NN].nowx][player[NN].nowy-1] == numXX) && (stageObject[player[NN].nowy-1][player[NN].nowx] == 203)){
        player[NN].face = 1;    //turn_up(NN);
    }
    else if ((stageText[player[NN].nowx-1][player[NN].nowy] == numXX) && (stageObject[player[NN].nowy][player[NN].nowx-1] == 203)){
        player[NN].face = 2;    //turn_left(NN);
    }
    else if ((stageText[player[NN].nowx][player[NN].nowy+1] == numXX) && (stageObject[player[NN].nowy+1][player[NN].nowx] == 203)){
        player[NN].face = 3;    //turn_down(NN);
    }
    else if ((stageText[player[NN].nowx+1][player[NN].nowy] == numXX)){
        player[NN].face = 0;    //turn_right(NN);
    }
    else if ((stageText[player[NN].nowx][player[NN].nowy-1] == numXX)){
        player[NN].face = 1;    //turn_up(NN);
    }
    else if ((stageText[player[NN].nowx-1][player[NN].nowy] == numXX)){
        player[NN].face = 2;    //turn_left(NN);
    }
    else if ((stageText[player[NN].nowx][player[NN].nowy+1] == numXX)){
        player[NN].face = 3;    //turn_down(NN);
    }else{
        return;                 //四周都沒有要前往的數字
    }    
    
      //！！應先判斷前方是否有路，再做移動
    let nextGround = 0;         //目標地塊的編號
    let nextObject = 0;         //目標地塊上的物品編號
    
    if (player[NN].face == 0){
        nextGround = stageGround[player[NN].nowy][player[NN].nowx+1];     
        nextObject = stageObject[player[NN].nowy][player[NN].nowx+1];
    }
    if (player[NN].face == 1){
        nextGround = stageGround[player[NN].nowy-1][player[NN].nowx];
        nextObject = stageObject[player[NN].nowy-1][player[NN].nowx];
    }
    if (player[NN].face == 2){
        nextGround = stageGround[player[NN].nowy][player[NN].nowx-1];
        nextObject = stageObject[player[NN].nowy][player[NN].nowx-1];
    }
    if (player[NN].face == 3){
        nextGround = stageGround[player[NN].nowy+1][player[NN].nowx];
        nextObject = stageObject[player[NN].nowy+1][player[NN].nowx];
    }
    
    
    if( !((nextGround>=1)&&(nextGround<=130)) ){
        sound_bump.play();
        camera0.shake(160,0.008);                      //指定晃動時間 和 強度
        //return "exit";
    }else if(nextObject>=232){   //232以上都不可行走( ((nextGround>=131)&&(nextGround<=160))||(nextObject>=232) ){
        sound_bump.play();
        camera0.shake(160,0.008);                      //指定晃動時間 和 強度
        //return "exit";
    }else{
        if (player[NN].face == 0){
            move_right(NN);
        }
        if (player[NN].face == 1){
            move_up(NN);
        }
        if (player[NN].face == 2){
            move_left(NN);
        }
        if (player[NN].face == 3){
            move_down(NN);       
        }
        if (nextObject==231) {return "exit";}              //掉入巨坑 
    }
}


var textFadeOutAnim =0;
//清除目前所在位置的數字
function clearNum(NN){         
    if(stageText[player[NN].nowx][player[NN].nowy] == -1){  return;  }
    
    stageText[player[NN].nowx][player[NN].nowy] =-1;
    textLayer[player[NN].nowx][player[NN].nowy].setColor("#f33");
    sound_clear.play();
    textFadeOutAnim = 1;                //啟動文字消失動畫
}
function textFadeOut(NN){
    textLayer[player[NN].nowx][player[NN].nowy].alpha -= 0.04;              //15影格字消失
    if(textLayer[player[NN].nowx][player[NN].nowy].alpha <= 0){
        textFadeOutAnim = 0;            //動畫停止
        textLayer[player[NN].nowx][player[NN].nowy].text = "";
        textLayer[player[NN].nowx][player[NN].nowy].setColor("#fff");
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
