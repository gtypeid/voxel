

import * as ut from './util.js';
import PointerLockControls from '../lib/PointerLockControls.js';
import * as THREE from '../lib/three.module.js';

var key = 
{
    k1 : 49,
    k2 : 50,

    g : 71,

    w : 87,
    s : 83,
    a : 65,
    d : 68,
    q : 81,
    e : 69,
    z : 90,
    x : 88,
    r : 82,
    t : 84,
    shift : 16,
    mlb : 0,
    mmb : 1,
    mrb : 2,

}

var keyFlag =
{
    forwrd : 0,
    left : 0,
    up : 0,
    w : false,
    s : false,
    a : false,
    b : false,
    q : false,
    e : false,
    shift : false,
    mlb : false,
    mmb : false,
    mrb : false,

}

class controller
{
    constructor()
    {
        this._mCore;
        this._mController;
        this._mKeyCode = key;
        this._mKeyFlag = keyFlag;
        this._mKeyDirection = new THREE.Vector3();

        this._mMouse;


        this.init();
    }

    tObject()
    {
        return this._mController;
    }

    init()
    {
        this._mCore = ut.getSclass(ut.nd.core);
        let core = this._mCore;

        let camera = core._mCamera.tObject();
        let container = core._mContainer;
        let scene = core._mScene.tObject();

        this._mMouse = new THREE.Vector2();
        
        this._mController = new PointerLockControls(camera, container);
        scene.add(this._mController.getObject() );

        container.addEventListener("click", event => { container.requestPointerLock();} );
    }

    onKeyDown(event)
    {
        const k = this._mKeyCode;
        let kf = this._mKeyFlag;

        this.onceKey(event.keyCode);

        switch( event.keyCode)
        {
            case k.w :
                kf.w = true;
                break;
            case k.s :
                kf.s = true;
                break;
            case k.a :
                kf.a = true;
                break;
            case k.d :
                kf.d = true;
                break;
            case k.q :
                kf.q = true;
                break;
            case k.e :
                kf.e = true;
                break;
            case k.shift :
                kf.shift = true;
                break;
            case k.g :

                break;

        }


    }

    onKeyUp(event)
    {
        const k = this._mKeyCode;
        let kf = this._mKeyFlag;
        switch( event.keyCode)
        {
            case k.w :
                kf.w = false;
                break;
            case k.s :
                kf.s = false;
                break;
            case k.a :
                kf.a = false;
                break;
            case k.d :
                kf.d = false;
                break;
            case k.q :
                kf.q = false;
                break;
            case k.e :
                kf.e = false;
                break;
            case k.shift :
                kf.shift = false;
                break;
            case k.g :

                break;

        }
    }

    onMouseDown(event)
    {
        const k = this._mKeyCode;
        let kf = this._mKeyFlag;
        switch( event.button)
        {
            case k.mlb :
                kf.mlb = true;
                break;
            case k.mrb :
                kf.mrb = true;
                break;
        }
    }

    onMouseUp(event)
    {
        const k = this._mKeyCode;
        let kf = this._mKeyFlag;
        switch( event.button)
        {
            case k.mlb :
                kf.mlb = false;
                break;
            case k.mrb :
                kf.mrb = false;
                break;
        }
    }
    onMouseMove(event)
    {
        this._mMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this._mMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    onceKey(param)
    {
        const k = this._mKeyCode;
        let kf = this._mKeyFlag;

        let renderer = this._mCore._mRenderer;
        let chunkM = this._mCore._mChunkManager;

        if(event.keyCode)
        {
            if(event.keyCode == k.k1)
            {
                const cks = this._mCore._mChunks;
                cks._mMat.wireframe = false;
                cks._mMat.opacity = 1.0;
            }

            if(event.keyCode == k.k2)
            {
                const cks = this._mCore._mChunks;
                cks._mMat.wireframe = true;
                cks._mMat.opacity = 0.3;
            }

            if(event.keyCode == k.z)
            {
                const { worldX, worldZ ,cellX, cellY, cellZ } = renderer._mRayPrvTargetData;
                if( chunkM.isChunk(worldX,worldZ) )
                {
                    let chunk = chunkM._mCellChunks[worldX][worldZ];

                    // 인덱스를 초과하는가
                    let hTopResult = chunk.getIsCell(cellX,cellY+1,cellZ);
                    let bTH = hTopResult.bFlag;
                    let bHCell = hTopResult.cell;

                    // 현재 위치
                    let hResult = chunk.getIsCell(cellX,cellY,cellZ);
                    let bH = hResult.bFlag;
                    let hCell = hResult.cell;

                    let cY = 0;
                    if(bH && bTH)
                    {
                        // 현 위치에 셀이 있다면 위에 생성
                        if(hCell)
                        {
                            cY = 1;
                            // 생성 하고자 하는데 위에 셀이 있다면 리턴
                            if(bHCell) return;
                        }

                        chunk._mCells[cellX][cellY + cY][cellZ] = 1;
                        chunkM.chunkActive(worldX,worldZ,false);
                        chunkM.chunkActive(worldX,worldZ,true);
                    }

                }

            }

            if(event.keyCode == k.x)
            {
                const { worldX, worldZ ,cellX, cellY, cellZ } = renderer._mRayPrvTargetData;
                if( chunkM.isChunk(worldX,worldZ) )
                {
                    let chunk = chunkM._mCellChunks[worldX][worldZ];
                    if(chunk.isbCell(cellX,cellY,cellZ))
                    {
                        chunk._mCells[cellX][cellY][cellZ] = 0;
                        chunkM.chunkActive(worldX,worldZ,false);
                        chunkM.chunkActive(worldX,worldZ,true);
                    }


                }

            }

            if(event.keyCode == k.r )
            {
                const { worldX, worldZ ,cellX, cellY, cellZ } = renderer._mRayPrvTargetData;
                if( chunkM.isChunk(worldX,worldZ) )
                {
                    let chunk = chunkM._mCellChunks[worldX][worldZ];

                    const cv = 1;

                    for( var x = cellX-cv; x <= cellX + cv; ++x)
                    {
                        for( var y = cellY-cv; y <= cellY + cv; ++y)
                        {
                            for( var z = cellZ-cv; z <= cellZ + cv; ++z)
                            {
                                if(chunk.isbCell(x,y,z))
                                {
                                    chunk._mCells[x][y][z] = 0;
                                }
                                // 다 파여서 없는걸로 접근하지 않음
                                else if(x != 0 && z != 0)
                                {

                                }
                            }
                        }
                    }

                    chunkM.chunkActive(worldX,worldZ,false);
                    chunkM.chunkActive(worldX,worldZ,true);

                }

            }

            if(event.keyCode == k.t )
            {
                const { worldX, worldZ ,cellX, cellY, cellZ } = renderer._mRayPrvTargetData;
                if( chunkM.isChunk(worldX,worldZ) )
                {
                    let chunk = chunkM._mCellChunks[worldX][worldZ];

                    const cv = 1;

                    for( var x = cellX-cv; x <= cellX + cv; ++x)
                    {
                        for( var y = cellY-cv; y <= cellY + cv; ++y)
                        {
                            for( var z = cellZ-cv; z <= cellZ + cv; ++z)
                            {
                                if(chunk.getIsCell(x,y,z).bFlag)
                                {
                                    chunk._mCells[x][y][z] = 1;
                                }
                                // 다 파여서 없는걸로 접근하지 않음
                                else if(x != 0 && z != 0)
                                {

                                }
                            }
                        }
                    }

                    chunkM.chunkActive(worldX,worldZ,false);
                    chunkM.chunkActive(worldX,worldZ,true);

                }

            }

        }
    }
    

    ketListner(delta)
    {
        let kf = this._mKeyFlag;
        let speed = 15;


        if(kf.w) kf.forwrd = 1;
        if(kf.s) kf.forwrd = -1;
        if(kf.a) kf.left = -1;
        if(kf.d) kf.left = 1;
        if(kf.q) kf.up = 1;
        if(kf.e) kf.up = -1;
        if(kf.mrb) speed = 150;


        this._mKeyDirection.x = 0;
        this._mKeyDirection.y = kf.left;
        this._mKeyDirection.z = kf.forwrd;

        if( ! (kf.w || kf.s) ) {
            this._mKeyDirection.z = 0;
          }
    
        if( ! (kf.a || kf.d) ) {
            this._mKeyDirection.y = 0;
          }

        if( ! (kf.q || kf.e) ) {
            kf.up = 0;
          }

        this._mController.moveForward( ( speed * delta  ) * this._mKeyDirection.z );
        this._mController.moveRight( ( speed * delta  ) * this._mKeyDirection.y );
        this._mController.moveUp( ( speed * delta  ) *kf.up );

        //
        let chunkM = this._mCore._mChunkManager;
        const position = this._mController.getObject().position;
        chunkM.updatePlayerPosition(position);

    }

    setPosition(x,y,z)
    {

        const obj = this._mController.getObject();
        obj.position.x = x;
        obj.position.y = y;
        obj.position.z = z;
    }

    onLockChange()
    {
    }
}


export default controller;