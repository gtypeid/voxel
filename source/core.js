
import * as ut from './util.js';
import * as THREE from '../lib/three.module.js';

import iScene from './scene.js';
import iRenderer from './renderer.js';
import iCamera from './camera.js';
import iController from './controller.js';
import itWindow from './tWindow.js';
import iChunkManager from './chunkManager.js';

class core
{

    constructor()
    {
        this._mScene;
        this._mRenderer;
        this._mContainer;
        this._mCamera;
        this._mController;
        this._mtWindow;
        this._mClock;
        this._mChunkManager;

        this._mTestAllRender = false;
        this._mTestBoxGeo = false;
        this._mTestWireRender = false;

        ut.setSclass(ut.nd.core, this);
        this.init();

    }

    init()
    {

        this._mScene = new iScene();
        this._mRenderer = new iRenderer();

        this._mContainer = document.getElementById("container");
        this._mContainer.appendChild(this._mRenderer.tObject().domElement);

        this._mCamera = new iCamera();
        this._mCamera.set(0,0,20);

        this._mController = new iController();
        this._mtWindow = new itWindow();
        this._mClock = new THREE.Clock();

        this._mChunkManager = new iChunkManager();


        this._mRenderer.renderStatRun();

        this.addLights();

    }

    addLights()
    {
        var lightOne = new THREE.DirectionalLight(0xffffff, 0.8);
        lightOne.position.set(1, 1, 1);
        this._mScene.tObject().add(lightOne);

        
    }



    run()
    {
        this._mRenderer.run();

    }

}

export default core;