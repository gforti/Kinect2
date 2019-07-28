(function(){

	var colorCanvas = document.getElementById('colorCanvas');

	var ImageBufferRendererWebgl = require('../shared/js/image-buffer-renderer-webgl.js');
	var colorRenderer = new ImageBufferRendererWebgl(colorCanvas);

	function processImageData(imageBuffer, width, height) {

		if (colorRenderer.isProcessing || (width <= 0) || (height <= 0)) {
			// Don't start processing new data when we are in the middle of
			// processing data already.
			// Also, Only do work if image data to process is of the expected size
			return;
		}

		colorRenderer.isProcessing = true;
		colorRenderer.processImageData(imageBuffer, width, height);
		colorRenderer.isProcessing = false;
	}

	



	
	})();
