function DrawCtrl($scope, JScribbleService) {

}

app.directive('drawingBoard', function() {
	var mydirective = {
		restrict: 'E',
		template: '<canvas></canvas>',
		stage: null,
		replace: true,
		
		link: function(scope, element, attrs) {

			scope.handleMouseDown = function() {
				debugger;
				if (this.stage.contains(title)) { 
	        		this.stage.clear(); 
	        		this.stage.removeChild(title); 
	    		}

	    		oldPt = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
	    		oldMidPt = oldPt;
	    		this.stage.addEventListener("stagemousemove" , scope.handleMouseMove);

	    		//socket.emit('draw', $.toJSON({  action: 'start', 
	            //                        user: clientName,
	            //                        start: oldMidPt,
	            //                        end:oldMidPt,
	            //                        color:penColor,
	            //                        stroke: stroke }));
			};

			scope.handleMouseMove = function() {
				debugger;
				var midPt = new createjs.Point(oldPt.x + this.stage.mouseX>>1, oldPt.y+this.stage.mouseY>>1);

	    		drawingCanvas.graphics.clear().setStrokeStyle(3 /* stroke */, 'round', 'round').beginStroke('#000000' /*penColor*/).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

	    		oldPt.x = this.stage.mouseX;
	    		oldPt.y = this.stage.mouseY;

	    		oldMidPt.x = midPt.x;
	    		oldMidPt.y = midPt.y;

	    		this.stage.update();

	    		//socket.emit('draw', $.toJSON({action: 'draw', user: clientName, start: oldMidPt, end:midPt, color:penColor, stroke: stroke }));
			};
			scope.handleMouseUp = function() {
				debugger;
				this.stage.removeEventListener("stagemousemove" , scope.handleMouseMove);
			};

			var canvas = angular.element(element)[0];

			//drawingCanvases[clientName] = canvas;

		    //check to see if we are running in a browser with touch support
		    this.stage = new createjs.Stage(canvas);

		    this.stage.autoClear = false;
		    this.stage.enableEvents(true);

		    createjs.Touch.enable(this.stage);
		    createjs.Ticker.setFPS(24);

		    var drawingCanvas = new createjs.Shape();
		    //drawingCanvases[clientName] = drawingCanvas;
debugger;
		    this.stage.addEventListener("stagemousedown", scope.handleMouseDown);
		    this.stage.addEventListener("stagemouseup", scope.handleMouseUp);

		    title = new createjs.Text("Click and Drag to draw", "36px Arial", "#777777");
		    title.x = 300;
		    title.y = 200;
		    this.stage.addChild(title);

		    this.stage.addChild(drawingCanvas);
		    this.stage.update();			
		}
	}
	return mydirective;
});