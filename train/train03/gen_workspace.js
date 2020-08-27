var workspace;

//每關可使用的最大方塊數量
let maxblock = [10,3,5,7,6,5,6,8,3,7,6,10];

function gen_workspace(toolbox_id){
		//var toolbox_id = "toolbox0?";

		var toolbox = document.getElementById(toolbox_id);
	   	var options = {
	 
		  	toolbox : toolbox,
		   
		  	collapse : true,
		  	comments : true,
		  	disable : true,
		  	maxBlocks : maxblock[ Number( toolbox_id.substr(-2) ) -10 ],             //Infinity,
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

        let b1 = document.getElementById('blocklyDiv');
        b1.innerHTML="";
	  	workspace = Blockly.inject('blocklyDiv',options );
	      //{toolbox: document.getElementById('toolbox')});
        //console.log(b1.innerHTML);
}