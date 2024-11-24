

import * as THREE from '../lib/three.module.js';
import * as ut from './util.js';

import rendererstats from '../lib/threex.rendererstats.js';

class renderer
{
    constructor()
    {
        this._mCore;
        this._mRenderer;

        this._mRaycaster;
        this._mRayPrvTarget;
        this._mRayPrvTargetData = {};


        this._mRendererStats;

        this.init();
    }

    tObject()
    {
        return this._mRenderer;
    }

    init()
    {
        this._mCore = ut.getSclass(ut.nd.core);
        let scene = this._mCore._mScene;

        this._mRenderer = new THREE.WebGLRenderer();
        this._mRenderer.setClearColor( scene.getFog().color );
        this._mRenderer.setPixelRatio(window.devicePixelRatio);
        this._mRenderer.setSize(window.innerWidth, window.innerHeight)

        this._mRaycaster = new THREE.Raycaster();
        this.makeRayTargetWire();

    }

    renderStatRun()
    {
        let chunkManager =  this._mCore._mChunkManager;

        this._mRendererStats = new rendererstats();
        this._mRendererStats.domElement.style.position	= 'absolute';
        this._mRendererStats.domElement.style.left	= '0px';
        this._mRendererStats.domElement.style.bottom	= '0px';

        this._mRendererStats.textWorld = chunkManager._mWorldCell;
        document.body.appendChild( this._mRendererStats.domElement );
    }


    run()
    {
        this.requestAnim();
    }

    requestAnim(time)
    {
        let delta = this._mCore._mClock.getDelta();
        let controller = this._mCore._mController;

        this.render();

        controller.ketListner(delta);
        window.requestAnimationFrame( this.requestAnim.bind(this)  );

    }

    render()
    {
        let renderer = this._mRenderer;
        let scene = this._mCore._mScene.tObject();
        let camera = this._mCore._mCamera.tObject();
        let mouse = this._mCore._mController._mMouse;
        let chunkManager =  this._mCore._mChunkManager;

        if(this._mRendererStats)
        {
            this._mRendererStats.textXY = chunkManager._mClientX + " / " +chunkManager._mClientZ;
            this._mRendererStats.update(this._mRenderer);
        }

        this._mRaycaster.setFromCamera( mouse, camera );

        this.rayCastObj( this._mRaycaster.intersectObjects( scene.children ) );

        renderer.render(scene,camera);
    }

    rayCastObj(objs)
    {

        if(objs.length > 0)
        {
            if(objs[0] && (objs[0].object != this.getRayWire()) )
            {
                this.setRayWire(objs[0]);
            }

        }
        else
        {
            
        }
    }

    setRayWire(rayResult)
    {
        const object = rayResult.object;
        const position = rayResult.point;
        const wire = this.getRayWire();
        
        const x = Math.floor ( position.x);
        const y = Math.floor ( position.y);
        const z = Math.floor ( position.z);

        wire.position.x = x + 0.5;
        wire.position.y = y - 0.5;
        wire.position.z = z + 0.5;

        this._mRayPrvTargetData.worldX = ( object.position.x ) / 16;
        this._mRayPrvTargetData.worldZ = ( object.position.z ) / 16;
        this._mRayPrvTargetData.cellX = x - (this._mRayPrvTargetData.worldX * 16);
        // -1 을 해야지 기본 값이 된다
        this._mRayPrvTargetData.cellY = y - 1;
        this._mRayPrvTargetData.cellZ = z - (this._mRayPrvTargetData.worldZ * 16);


    }

    makeRayTargetWire()
    {
        let scene = this._mCore._mScene.tObject();
            
        let geo = new THREE.BoxBufferGeometry( 1, 1 ,1  );
        let wireframe = new THREE.WireframeGeometry( geo );

        let line = new THREE.LineSegments( wireframe );
        line.material.color.setHex("0xFF0000");
        line.material.opacity = 1;

        this._mRayPrvTargetData.rayWire = line;
        scene.add( line );
    }

    getRayWire()
    {
        return this._mRayPrvTargetData.rayWire;
    }



}

export default renderer;

            /*
            if(objs[0].object.material)
            {
                
                this._mRayPrvTarget = objs[0].object;
                this._mRayPrvTargetData.currentHex = this._mRayPrvTarget.material.emissive.getHex();
                this._mRayPrvTarget.material.emissive.setHex( 0xff0000 );

                
            }
            */

            /*
            if(this._mRayPrvTarget && this._mRayPrvTarget.material)
            {
                this._mRayPrvTarget.material.emissive.setHex( this._mRayPrvTarget.currentHex );
                this._mRayPrvTarget = null;
                this._mRayPrvTargetData.currentHex = null;
            }
            */