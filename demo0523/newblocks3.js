
/*
{
  "type": "action_turn_left",
  "message0": "左轉 %1",
  "args0": [
    {
      "type": "field_image",
      "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
      "width": 30,
      "height": 30,
      "alt": "pic",
      "flipRtl": false
    }
  ],
  "colour": 0,
  "tooltip": "turn left",
  "helpUrl": ""
}*/

Blockly.Blocks['action_turn_left'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("左轉")
        .appendField(new Blockly.FieldImage("pic/turn_left.png", 30, 30, "pic"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("aaa000");
 this.setTooltip("turn left");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_turn_left'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'turn_left(0);\n await delay(1000); \n';
  return code;
};


Blockly.Blocks['action_turn_right'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("右轉")
        .appendField(new Blockly.FieldImage("pic/turn_right.png", 30, 30, "pic"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("aaa000");
 this.setTooltip("turn right");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_turn_right'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'turn_right(0);\n await delay(1000); \n';
  return code;
};


Blockly.Blocks['action_move_back'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("後退")
        .appendField(new Blockly.FieldImage("pic/star_on.gif", 20, 20, { alt: "pic", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("aaa000");
 this.setTooltip("go backward");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_move_back'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'move_back(0);\n await delay(1000); \n';
  return code;
};


Blockly.Blocks['action_move_forward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("前進")
        .appendField(new Blockly.FieldImage("pic/go.png", 30, 30, { alt: "pic", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("aaa000");
 this.setTooltip("go ahead");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_move_forward'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = ' if(move_forward(0)=="exit"){return;} \n await delay(1000); \n';
  return code;
};



Blockly.Blocks['action_eat'] = {
  init: function() {
    this.appendValueInput("num0")
        .setCheck(null)
        .appendField(new Blockly.FieldImage("pic/pacman2.png", 40, 40, { alt: "pic", flipRtl: "FALSE" }));
        //.appendField("吃");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("9f0000");      //可給色碼 "#000000"
 this.setTooltip("eat");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_eat'] = function(block) {
  let value_num0 = Blockly.JavaScript.valueToCode(block, 'num0', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  let code = 'eat(' + value_num0 + ',0);\n await delay(1000); \n';
    //let code = 'console.log(' + value_num0 + ');\n milisec+=1000;\n console.log(j);\n';
  return code;
};

//===========================
Blockly.Blocks['action_eat1'] = {
  init: function() {
    this.appendValueInput("num0")
        .setCheck(null)
        .appendField(new Blockly.FieldImage("pic/pacman02.png", 40, 40, { alt: "pic", flipRtl: "FALSE" }));
        //.appendField("吃");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("006f00");      //可給色碼 "#000000"
 this.setTooltip("eat");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_eat1'] = function(block) {
  let value_num0 = Blockly.JavaScript.valueToCode(block, 'num0', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  let code = 'eat(' + value_num0 + ',1);\n await delay(1000); \n';
    //let code = 'console.log(' + value_num0 + ');\n milisec+=1000;\n console.log(j);\n';
  return code;
};
/*

   var toolbox = document.getElementById("toolbox");
   var options = {
 
    toolbox : toolbox,
   
    collapse : true,
    comments : true,
    disable : true,
    maxBlocks : Infinity,
    trashcan : true,
    horizontalLayout : false,
    toolboxPosition : 'start',
    css : true,
    media : 'https://blockly-demo.appspot.com/static/media/',    //
    rtl : false,
    scrollbars : true,
    sounds : true,
    oneBasedIndex : true,
    zoom : {
      controls : true,
      wheel : true,
      startScale : 1,
      maxScale : 3,
      minScale : 0.3,
      scaleSpeed : 1.2
    }

  };





  var workspace = Blockly.inject('blocklyDiv',options );
      //{toolbox: document.getElementById('toolbox')});

    function showCode() {
      // Generate JavaScript code and display it.
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      var code = Blockly.JavaScript.workspaceToCode(workspace);
      alert(code);
      console.log('123123');
    }

*/