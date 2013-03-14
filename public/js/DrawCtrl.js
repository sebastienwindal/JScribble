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

	    		oldPt = new createjs.Point(scope.stage.mouseX, scope.stage.mouseY);
	    		oldMidPt = oldPt;
	    		scope.stage.addEventListener("stagemousemove" , scope.handleMouseMove);

	    		//socket.emit('draw', $.toJSON({  action: 'start', 
	            //                        user: clientName,
	            //                        start: oldMidPt,
	            //                        end:oldMidPt,
	            //                        color:penColor,
	            //                        stroke: stroke }));
			};

			scope.handleMouseMove = function() {

				var midPt = new createjs.Point(oldPt.x + scope.stage.mouseX>>1, oldPt.y+scope.stage.mouseY>>1);

	    		drawingCanvas.graphics.clear()	.setStrokeStyle(5 /* stroke */, 'round', 'round')
	    										.beginStroke('#000000' /*penColor*/)
	    										.moveTo(midPt.x, midPt.y)
	    										.curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

	    		oldPt.x = scope.stage.mouseX;
	    		oldPt.y = scope.stage.mouseY;

	    		oldMidPt.x = midPt.x;
	    		oldMidPt.y = midPt.y;

	    		scope.stage.update();

	    		//socket.emit('draw', $.toJSON({action: 'draw', user: clientName, start: oldMidPt, end:midPt, color:penColor, stroke: stroke }));
			};

			scope.handleMouseUp = function() {
				scope.stage.removeEventListener("stagemousemove" , scope.handleMouseMove);
			};

			scope.stageResize = function() { 
 		       	scope.stage.canvas.width = element.width();
        		scope.stage.canvas.height = element.height();       
    		}

			var canvas = angular.element(element)[0];

			$(window).resize(function() {
			  	scope.stageResize();
			});
			//drawingCanvases[clientName] = canvas;

		    //check to see if we are running in a browser with touch support
		    scope.stage = new createjs.Stage(canvas);

		    scope.stage.autoClear = false;
		    scope.stage.enableEvents(true);

		    createjs.Touch.enable(scope.stage);
		    createjs.Ticker.setFPS(24);

		    var drawingCanvas = new createjs.Shape();
		    //drawingCanvases[clientName] = drawingCanvas;

		    scope.stage.addEventListener("stagemousedown", scope.handleMouseDown);
		    scope.stage.addEventListener("stagemouseup", scope.handleMouseUp);

		    scope.stage.addChild(drawingCanvas);
		    scope.stage.update();			
		}
	}
	return mydirective;
});