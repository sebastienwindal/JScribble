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
    		scope.oldMidPts = {};

			scope.handleMouseDown = function() {

	    		scope.oldPt = new createjs.Point(scope.stage.mouseX, scope.stage.mouseY);
	    		scope.oldMidPt = scope.oldPt;
	    		scope.stage.addEventListener("stagemousemove" , scope.handleMouseMove);
				
				if (!scope.strokeSize)
					scope.strokeSize = 5;
				if (!scope.penColor)
					scope.penColor = "#000";

				scope.onStartDraw({	start: scope.oldMidPt, 
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

    		scope.$on('remoteDraw', function(evt, msg) {

    			if (msg.action == "start") {
    				debugger;
					var currentDrawingCanvas = scope.drawingCanvases[msg.userId];
	    			if (currentDrawingCanvas == null) {
	        			currentDrawingCanvas = new createjs.Shape();
	        			scope.drawingCanvases[msg.userId] = currentDrawingCanvas;
	        			scope.stage.addChild(currentDrawingCanvas);
	        		}
	        		scope.oldPts[msg.userId] = new createjs.Point(msg.start.x, msg.start.y);
	    			scope.oldMidPts[msg.userId] = scope.oldPts[msg.userId]
    			} else if (msg.action == "draw") {
    				var currentDrawingCanvas = scope.drawingCanvases[msg.userId];
    				if (currentDrawingCanvas == null)
    					currentDrawingCanvas = scope.canvas;

    				var midPt = new createjs.Point(	scope.oldPts[msg.userId].x + msg.start.x>>1, 
    												scope.oldPts[msg.userId].y + msg.start.y>>1);

    				currentDrawingCanvas
    					.graphics
    					.clear()
    					.setStrokeStyle(msg.stroke, 'round', 'round')
    					.beginStroke(msg.color)
    					.moveTo(midPt.x, midPt.y)
    					.curveTo(scope.oldPts[msg.userId].x, scope.oldPts[msg.userId].y, scope.oldMidPts[msg.userId].x, scope.oldMidPts[msg.userId].y);

    				scope.oldPts[msg.userId].x = msg.end.x;
    				scope.oldPts[msg.userId].y = msg.end.y;

				    scope.oldMidPts[msg.userId].x = midPt.x;
				    scope.oldMidPts[msg.userId].y = midPt.y;

    				scope.stage.update();


    				// scope.canvas.graphics.clear()
    				// 	.setStrokeStyle(msg.stroke, 'round', 'round')
    				// 	.beginStroke(msg.color)
    				// 	.moveTo(msg.end.x, msg.end.y)
    				// 	.curveTo(msg.end.x, msg.end.y, msg.end.x, msg.end.y)
    				// 		;
    				// scope.stage.update();	
    			}
    			
    		});


			scope.canvas = angular.element(element)[0];

			$(window).resize(function() {
			  	scope.stageResize();
			});
			//drawingCanvases[clientName] = canvas;

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