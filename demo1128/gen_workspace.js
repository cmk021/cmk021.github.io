var workspace;

function gen_workspace(toolbox_id){
		//var toolbox_id = "toolbox";

		var toolbox = document.getElementById(toolbox_id);
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
		  	media : 'media/',    //
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


	  	workspace = Blockly.inject('blocklyDiv',options );
	      //{toolbox: document.getElementById('toolbox')});
}