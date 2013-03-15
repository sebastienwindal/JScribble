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
			onDraw: "&onDraw",
			onStartDraw: "&onStartDraw"
		},
		
		link: function(scope, element, attrs) {

			scope.drawingCanvases = {};
			scope.oldPts = {};

			scope.handleMouseDown = function() {

	    		scope.oldPt = new createjs.Point(scope.stage.mouseX, scope.stage.mouseY);
	    		
	    		scope.stage.addEventListener("stagemousemove" , scope.handleMouseMove);
				
				if (!scope.strokeSize)
					scope.strokeSize = 5;
				if (!scope.penColor)
					scope.penColor = "#000";

				scope.onStartDraw({	start: scope.oldPt, 
									color: scope.penColor, 
									stroke: scope.strokeSize } );

			};

			scope.handleMouseMove = function() {

				if (!scope.strokeSize)
					scope.strokeSize = 5;
				if (!scope.penColor)
					scope.penColor = "#000";

				var start = new createjs.Point(scope.oldPt.x, scope.oldPt.y);
				var end = new createjs.Point(scope.stage.mouseX, scope.stage.mouseY);

	    		drawingCanvas.graphics.clear()	.setStrokeStyle(scope.strokeSize, 'round', 'round')
	    										.beginStroke(scope.penColor)
	    										.moveTo(start.x, start.y)
	    										.lineTo(end.x, end.y);

	    		scope.stage.update();

	    		scope.oldPt = end

				scope.onDraw({	start: start, 
								end: end,
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

    		scope.$on('remoteDraw', function(evt, msg) {

    			if (msg.action == "start") {
					var currentDrawingCanvas = scope.drawingCanvases[msg.userId];
	    			if (currentDrawingCanvas == null) {
	        			currentDrawingCanvas = new createjs.Shape();
	        			scope.drawingCanvases[msg.userId] = currentDrawingCanvas;
	        			scope.stage.addChild(currentDrawingCanvas);
	        		}
	        		scope.oldPts[msg.userId] = new createjs.Point(msg.start.x, msg.start.y);
    			} else if (msg.action == "draw") {
    				var currentDrawingCanvas = scope.drawingCanvases[msg.userId];
    				if (currentDrawingCanvas == null)
    					currentDrawingCanvas = scope.canvas;

    				var start = scope.oldPts[msg.userId];
    				var end = msg.end;

    				currentDrawingCanvas
    					.graphics
    					.clear()
    					.setStrokeStyle(msg.stroke, 'round', 'round')
    					.beginStroke(msg.color)
    					.moveTo(start.x, start.y)
    					.lineTo(end.x, end.y);

    				scope.stage.update();

    				scope.oldPts[msg.userId] = end;
    			}
    			
    		});


			scope.canvas = angular.element(element)[0];

			$(window).resize(function() {
			  	scope.stageResize();
			});

		    //check to see if we are running in a browser with touch support
		    scope.stage = new createjs.Stage(scope.canvas);

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