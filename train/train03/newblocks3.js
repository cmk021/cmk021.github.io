Blockly.Blocks['something_ahead'] = {
    init: function() {
    //this.appendDummyInput()
    //    .appendField(new Blockly.FieldDropdown([["前方有路","'way'"], ["前方有樹","'tree'"], ["前方有水池","'pool'"]]), "opt");                      // "'way'" 重要！！
        this.appendDummyInput().appendField(new Blockly.FieldDropdown([["前方有路","'way'"]]), "opt");
        this.setOutput(true, "Boolean");
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['something_ahead'] = function(block) {
    var dropdown_opt = block.getFieldValue('opt');
    // TODO: Assemble JavaScript into code variable.

    var code;                     //！！重要
     code = "something_ahead(0," +dropdown_opt+ ");";
    console.log(code);
    /*if (dropdown_opt=="way"){
        code = "something_ahead(0,'way')";   }
    else if (dropdown_opt=="tree"){
        code = "something_ahead(0,'tree')";   }
    else if (dropdown_opt=="pool"){
        code = "something_ahead(0,'pool')";   }
    */
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.Blocks['num_4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["4","OPT_4"]]), "opt");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['num_4'] = function(block) {
  var dropdown_opt = block.getFieldValue('opt');
  // TODO: Assemble JavaScript into code variable.
  var code = '4';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.Blocks['num_2to4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["2","2"], ["3","3"], ["4","4"]]), "opt");  //重要！
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['num_2to4'] = function(block) {
  var dropdown_opt = block.getFieldValue('opt');
  // TODO: Assemble JavaScript into code variable.
  var code = dropdown_opt;                                  //重要！！
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


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
        .appendField(new Blockly.FieldImage("pic/back120.png", 60, 30, { alt: "pic", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("aaa000");
 this.setTooltip("go backward");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_move_back'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = ' if(move_back(0)=="exit"){return;} \n await delay(1000); \n  while(player[0].move!= -1){await delay(1000);} \n';
  return code;                          //\n  codeOver=2; \n
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
  var code = ' if(move_forward(0)=="exit"){return;} \n await delay(1000); \n  while(player[0].move!= -1){await delay(1000);} \n';
  return code;                            //\n  codeOver=2; \n  
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
