import * as THREE from './three.module.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author jetienne / http://jetienne.com/
 * @author loopmode / http://xailabs.de
 */


/**
 * @return {object}
 * @property {element} domElement - The DOM element container (automatically created )
 * @property {function} update - Updates the stats. Expects a `webGLRenderer` reference. Resets output if no renderer reference is provided.
*/
var THREEx = function RendererStats() {
	var msMin = 100;
	var msMax = 0;

	var container = document.createElement('div');
	container.style.cssText = 'width:150px;opacity:0.6;cursor:pointer';

	var msDiv = document.createElement('div');
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#200;';
	container.appendChild(msDiv);

	var msText = document.createElement('div');
	msText.style.cssText =
		'color:#f00;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML = 'WebGLRenderer';
	msDiv.appendChild(msText);

	var msTexts = [];
	var nLines = 10;
	for (var i = 0; i < nLines; i++) {
		msTexts[i] = document.createElement('div');
		msTexts[i].style.cssText =
			'color:#f00;background-color:#311;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;line-height:15px';
		msDiv.appendChild(msTexts[i]);
		msTexts[i].innerHTML = '-';
    }
	var lastTime = Date.now();
	return {
		domElement: container,

		update: function(webGLRenderer) {
			// sanity check
			// webGLRenderer && console.assert(webGLRenderer instanceof THREE.WebGLRenderer)

			// refresh only 30time per second
			if (Date.now() - lastTime < 1000 / 30) return;
			lastTime = Date.now();

			var i = 0;
			msTexts[i++].textContent = '== Memory =====';
			msTexts[i++].textContent = 'Programs: ' + (webGLRenderer ? webGLRenderer.info.programs.length : '-');
			msTexts[i++].textContent = 'Geometries: ' + (webGLRenderer ? webGLRenderer.info.memory.geometries : '-');
			msTexts[i++].textContent = 'Textures: ' + (webGLRenderer ? webGLRenderer.info.memory.textures : '-');

			msTexts[i++].textContent = '== Render =====';
			msTexts[i++].textContent = 'Calls: ' + (webGLRenderer ? webGLRenderer.info.render.calls : '-');
			msTexts[i++].textContent = 'Triangles: ' + (webGLRenderer ? webGLRenderer.info.render.triangles : '-');

			msTexts[i++].textContent = '== Voxel =====';
			msTexts[i++].textContent = 'World: ' + this.textWorld;
			msTexts[i++].textContent = 'XZ: ' + this.textXY;

			
		}
	};
};

export default THREEx;