
import * as ut from './util.js';

class tWindow
{
    constructor()
    {
        this._mCore;
        this._mController;
        this._mCamera;
        this.init();
    }

    init()
    {
        this._mCore = ut.getSclass(ut.nd.core);
        this._mController = this._mCore._mController;
        this._mCamera = this._mCore._mCamera;

        window.addEventListener("resize", this.onWindowResize.bind(this) , false);
        window.addEventListener("keydown", this.onKeyDown.bind(this), false);
        window.addEventListener("keyup", this.onKeyUp.bind(this) , false);
        window.addEventListener("mousedown", this.onMouseDown.bind(this), false );
        window.addEventListener("mouseup", this.onMouseUp.bind(this), false );
        window.addEventListener("mousemove", this.onMouseMove.bind(this), false );

    }

    onWindowResize(event)
    {
        let camera = this._mCamera.tObject();
        let renderer = this._mCore._mRenderer.tObject();

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onKeyDown(event)
    {
        this._mController.onKeyDown(event);
    }

    onKeyUp(event)
    {
        this._mController.onKeyUp(event);
    }

    onMouseDown(event)
    {
        this._mController.onMouseDown(event);
    }

    onMouseUp(evnet)
    {
        this._mController.onMouseUp(event);
    }
    onMouseMove(event)
    {
        this._mController.onMouseMove(event);
    }
}

export default tWindow;