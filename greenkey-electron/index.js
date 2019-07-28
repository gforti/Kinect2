var Kinect2 = require('kinect2'), //change to 'kinect2' in a project of your own
	express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

var kinect = new Kinect2();

if(kinect.open()) {
	server.listen(8000);
	console.log('Server listening on port 8000');
	console.log('Point your browser to http://localhost:8000');

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/public/index.html');
	});

	app.use(express.static(__dirname + '/public'));

  var trackedBodyIndex = -1;
  var emptyPixels = new Uint8Array(1920 * 1080 * 4);
  
  function getClosestBodyIndex(bodies) {
		var closestZ = Number.MAX_VALUE;
		var closestBodyIndex = -1;
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].tracked && bodies[i].joints[Kinect2.JointType.spineMid].cameraZ < closestZ) {
				closestZ = bodies[i].joints[Kinect2.JointType.spineMid].cameraZ;
				closestBodyIndex = i;
			}
		}
		return closestBodyIndex;
	}

  if(kinect.open()) {
		kinect.on('multiSourceFrame', function(frame){
			var closestBodyIndex = getClosestBodyIndex(frame.body.bodies);
			if(closestBodyIndex !== trackedBodyIndex) {
				if(closestBodyIndex > -1) {
					kinect.trackPixelsForBodyIndices([closestBodyIndex]);
				} else {
					kinect.trackPixelsForBodyIndices(false);
          //clear canvas
          io.sockets.sockets.forEach(function(socket){
            socket.volatile.emit('colorFrame', emptyPixels.buffer);
          });
				}
			}
			else {
				if(closestBodyIndex > -1) {
					if(frame.bodyIndexColor.bodies[closestBodyIndex].buffer) {
           
            io.sockets.sockets.forEach(function(socket){
              socket.volatile.emit('colorFrame', frame.bodyIndexColor.bodies[closestBodyIndex].buffer);
            });
					}
				}
			}
			trackedBodyIndex = closestBodyIndex;
		});

		kinect.openMultiSourceReader({
			frameTypes: Kinect2.FrameType.bodyIndexColor | Kinect2.FrameType.body
		});
	}


					
}
