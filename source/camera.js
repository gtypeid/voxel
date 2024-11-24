
import * as THREE from '../lib/three.module.js';

class camera
{
    constructor()
    {
        this._mCamera;
        
        this.init();
    }

    tObject()
    {
        return this._mCamera;
    }

    init()
    {
        this._mCamera = new THREE.PerspectiveCamera(50,window.innerWidth / window.innerHeight, 1, 1000);
    }


    set(x,y,z)
    {
        // this._mCamera.set(x,y,z);

        this._mCamera.x = x;
        this._mCamera.y = y;
        this._mCamera.z = z;
    }
}

export default camera;