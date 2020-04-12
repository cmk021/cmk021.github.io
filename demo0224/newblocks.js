Blockly.Blocks['action_move_back'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("後退")
        .appendField(new Blockly.FieldImage("https://www.gstatic.com/codesite/ph/images/star_on.gif", 20, 20, { alt: "pic", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("go back");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_move_back'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'move_back();\n';
  return code;
};


Blockly.Blocks['action_move_forward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("前進")
        .appendField(new Blockly.FieldImage("https://www.gstatic.com/codesite/ph/images/star_on.gif", 20, 20, { alt: "pic", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("go ahead");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['action_move_forward'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'setTimeout("move_forward()",2000);\n';
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