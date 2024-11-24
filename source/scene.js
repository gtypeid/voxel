import * as THREE from '../lib/three.module.js';

class scene
{
    constructor()
    {
        this._mScene;

        this.init();

    }

    tObject()
    {
        return this._mScene;
    }

    init()
    {
        this._mScene = new THREE.Scene();
        this._mScene.fog = new THREE.FogExp2(0xcccccc, 0.0015);
    }

    getFog()
    {
        return this._mScene.fog;
    }


}

export default scene;