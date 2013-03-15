function DrawCtrl($scope, JScribbleService) {

	$scope.onDraw = function(start, end, color, stroke) {
		
		JScribbleService.addDrawSegment(start, end, color, stroke);
	}

	$scope.onStartDraw = function(start, color, stroke) {
		
		JScribbleService.sendStartDraw(start, color, stroke);
	}
}

app.directive('drawingBoard', function() {
	var mydirective = {
		restrict: 'E',
		template: '<canvas></canvas>',
		stage: null,
		replace: true,
		scope: {
			strokeSize: "@strokeSize",
			penColor: "@penColor",
			onDraw: "&onDraw"
		},
		
		link: function(scope, element, attrs) {

			scope.handleMouseDown = function() {

	    		scope.oldPt = new createjs.Point(scope.stage.mouseX, scope.stage.mouseY);
	    		scope.oldMidPt = scope.oldPt;
	    		scope.stage.addEventListener("stagemousemove" , scope.handleMouseMove);

				scope.onDraw({	start: scope.oldMidPt, 
								end: scope.oldMidPt, 
								color: scope.penColor, 
								stroke: scope.strokeSize } );

			};

			scope.handleMouseMove = function() {

				scope.midPt = new createjs.Point(scope.oldPt.x + scope.stage.mouseX>>1, scope.oldPt.y+scope.stage.mouseY>>1);
				if (!scope.strokeSize)
					scope.strokeSize = 5;
				if (!scope.penColor)
					scope.penColor = "#000";

	    		drawingCanvas.graphics.clear()	.setStrokeStyle(scope.strokeSize, 'round', 'round')
	    										.beginStroke(scope.penColor)
	    										.moveTo(scope.midPt.x, scope.midPt.y)
	    										.curveTo(scope.oldPt.x, scope.oldPt.y, scope.oldMidPt.x, scope.oldMidPt.y);

	    		scope.oldPt.x = scope.stage.mouseX;
	    		scope.oldPt.y = scope.stage.mouseY;

	    		scope.oldMidPt.x = scope.midPt.x;
	    		scope.oldMidPt.y = scope.midPt.y;

	    		scope.stage.update();

				scope.onDraw({	start: scope.oldMidPt, 
								end: scope.midPt,
								color: scope.penColor, 
								stroke: scope.strokeSize });
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