addBlocks = [ 
            '<category name="行動" colour="#aaa000">',                //0  行動
            '<block type="action_move_forward"></block>',
            '<block type="action_turn_left"></block>',
            '<block type="action_turn_right"></block>',
            '<block type="action_move_back"></block>',
            '<block type="action_turn_to_num"></block>',             //5  
            '<block type="action_clear_num"></block>',               
            '<block type="action_goto_num"></block>',
            '',               
            '',               
            '<category name="重複" colour="#5ba55b">',             //10               
            '<block type="controls_repeat_ext"></block>',               
            '<block type="controls_whileUntil"><field name="MODE">WHILE</field></block>',               
            '<block type="controls_for"><field name="VAR">i</field></block>',               
            '<block type="controls_flow_statements" disabled="true"><field name="FLOW">BREAK</field></block>',
            '',             //15               
            '',               
            '',               
            '',               
            '',               
            '<category name="選擇(邏輯)" colour="#5b80a5">',             //20               
            '<block type="controls_if"></block>',               //if  then  else
            '<block type="something_ahead3"></block>',              //前左右方有路               
            '<block type="something_ahead2"></block>',              //前方有樹山水 
            '<block type="logic_compare"><field name="OP">EQ</field></block>',               //比較運算
            '<block type="logic_operation"><field name="OP">AND</field></block>',             //25   //和、或
            '<block type="logic_negate"></block>',               //not
            '<block type="logic_boolean"><field name="BOOL">TRUE</field></block>',       //真假 
            '',               
            '',               
            '<category name="數學運算" colour="#5b67a5">',             //30               
            '<block type="math_number"><field name="NUM">0</field></block>',               //數字
            '<block type="math_arithmetic"><field name="OP">ADD</field></block>',            //加減乘除
            '<block type="math_number_property"><field name="PROPERTY">EVEN</field></block>',   //奇偶  
            '<block type="math_modulo"></block>',               //mod
            '',             //35               
            '',               
            '',               
            '',               
            '',               
            '<category name="變數" colour="#a55b80" custom="VARIABLE"/>',             //40               
            '',                            
            '</category>'];

//
//      以下都是 定義新的 方塊，及其對應的程式碼
//
Blockly.Blocks['action_goto_num'] = {
  init: function() {
    this.appendValueInput("numb1")
        .setCheck("Number")
        .appendField("前往數字");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("aaa000");
 this.setTooltip("前往指定的數字");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_goto_num'] = function(block) {
  var value_numb1 = Blockly.JavaScript.valueToCode(block, 'numb1', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'gotoNum(0,' + value_numb1 + ');\n await delay(1000); \n';
  return code;
};


Blockly.Blocks['action_clear_num'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("清除數字");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("aaa000");
 this.setTooltip("會將目前所在位置的數字清除");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_clear_num'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'clearNum(0);\n await delay(1000); \n';
  return code;
};


Blockly.Blocks['action_turn_to_num'] = {
  init: function() {
    this.appendValueInput("NUM1")
        .setCheck("Number")
        .appendField("數字羅盤")
        .appendField(new Blockly.FieldImage("pic/991.png", 40, 40, "pic"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("aaa000");
    this.setTooltip("會讓主角轉向指定的數字（以有鑽石的地方優先）");
    this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_turn_to_num'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'NUM1', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'turnToNum(0,' + value_num1 + ');\n await delay(1000); \n';
  return code;
};


Blockly.Blocks['something_ahead3'] = {
    init: function() {
    //this.appendDummyInput()
    //    .appendField(new Blockly.FieldDropdown([["前方有路","'way'"], ["前方有樹","'tree'"], ["前方有山","'mont'"]]), "opt");                      // "'way'" 重要！！
        this.appendDummyInput().appendField(new Blockly.FieldDropdown([["前方有樹","'tree'"], ["前方有山","'mont'"], ["前方有河","'river'"] ]), "opt");
        this.setOutput(true, "Boolean");
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['something_ahead3'] = function(block) {
    var dropdown_opt = block.getFieldValue('opt');
    // TODO: Assemble JavaScript into code variable.

    var code;                     //！！重要
     code = "something_ahead(0," +dropdown_opt+ ")";
    console.log(code);
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['something_ahead2'] = {
    init: function() {
    //this.appendDummyInput()
        this.appendDummyInput().appendField(new Blockly.FieldDropdown([["前方有路","'way'"], ["左方有路","'Lway'"], ["右方有路","'Rway'"] ]), "opt");
        this.setOutput(true, "Boolean");
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['something_ahead2'] = function(block) {
    var dropdown_opt = block.getFieldValue('opt');
    // TODO: Assemble JavaScript into code variable.

    var code;                     //！！重要
     code = "something_ahead(0," +dropdown_opt+ ")";
    console.log(code);
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
