
import * as THREE from '../lib/three.module.js';
import * as ut from './util.js';

 

class chunk
{
    constructor(x,z, sx,sy,sz)
    {
        this._mCore;

        // ChunkParent Position
        this._mX = x;
        this._mZ = z;

        this._mSizeX = sx;
        this._mSizeY = sy;
        this._mSizeZ = sz;

        this._mbActive = false;
        this._mWireMeh;
        this._mColor;

        this._mCells = [];
        this._mSelfCube;
        this.init();

    }

    init()
    {
        this._mCore = ut.getSclass(ut.nd.core);
        this._mColor = this.getColor( ut.randomInt(1,7));

        var myrng = new Math.seedrandom( ut.randomInt(0,33) );

        
        for( var x = 0 ; x < this._mSizeX; ++x){
            this._mCells.push([]);
            for( var y = 0 ; y < this._mSizeY; ++y){
                this._mCells[x].push([]);
                for( var z = 0 ; z < this._mSizeZ; ++z){
                    this._mCells[x][y].push( 0); // ut.seedMixedValue(myrng(),0,7)
                }

            }
        }

    }

    boxGeometry()
    {
        const {_mX, _mY,  _mZ, _mSizeX, _mSizeZ, _mSizeY} = this;
        let scene = this._mCore._mScene.tObject();

        let geo = new THREE.BoxBufferGeometry( _mSizeX, _mSizeY ,_mSizeZ  );
        var wireframe = new THREE.WireframeGeometry( geo );
        let line = new THREE.LineSegments( wireframe );
        line.material.color.setHex("0xffffff");
        line.material.opacity = 1;

        line.position.set( (_mX * (_mSizeX) + (_mSizeX /2)) , (_mSizeY / 2), (_mZ * (_mSizeZ) + (_mSizeX /2))   );
        scene.add( line );

        this._mWireMeh = line;

    }

    getIsCell(x,y,z)
    {
        let bFlag = false;
        let cell = null;
        if( (this._mCells[x] != undefined)  &&
            (this._mCells[x][y] != undefined) &&
            (this._mCells[x][y][z] != undefined) )
        {
            bFlag = true;
            cell = this._mCells[x][y][z];
        }

        return {
            bFlag,
            cell,
        };
    }

    isbCell(x,y,z)
    {
        let { bFlag } = this.getIsCell(x,y,z);
        if(bFlag)
        {
            // air
            if ( this._mCells[x][y][z] == 0)
            {
                bFlag = false;
            }
        }
        return bFlag;
    }

    makeMash()
    {
        const {_mX,_mZ, _mSizeX, _mSizeZ} = this;
        let scene = this._mCore._mScene.tObject();

        let {geometry,material} = this.mergeGeometry();

        let cube = new THREE.Mesh(geometry,material);

        cube.position.set( ( (_mX * (_mSizeX) )  ) , 0, ( (_mZ * (_mSizeZ) )  ) );

        //
        material.wireframe = this._mCore._mTestWireRender;
        scene.add(cube);

        this._mSelfCube = cube;

    }

    mergeGeometry()
    {
        let vertices = [];
        let vIndex = [];

        for( var x = 0 ; x < this._mSizeX; ++x)
        {
            for( var y = 0 ; y < this._mSizeY; ++y)
            {
                for( var z = 0; z < this._mSizeZ; ++z)
                {
                    let { bFlag , cell} = this.getIsCell(x,y,z);

                    if(bFlag && cell !== 0)
                    {
                        let front = this.isbCell(x,y,z+1);
                        let right = this.isbCell(x+1,y,z);
                        let back = this.isbCell(x,y,z-1);
                        let left = this.isbCell(x-1,y,z);
                        let top = this.isbCell(x,y+1,z);
                        let bottom = this.isbCell(x,y-1,z);

                        // append
                        if(!front)
                        {
                            vertices.push(
                                { pos: [ x + 0, y + 0,  z + 1], norm: [ x + 0,  y + 0,  z + 1] },
                                { pos: [ x + 1, y + 0,  z + 1], norm: [ x + 0,  y + 0,  z + 1] },
                                { pos: [ x + 0,  y + 1,  z + 1], norm: [ x + 0,  y + 0,  z + 1] },
                                { pos: [ x + 1,  y + 1,  z + 1], norm: [ x + 0,  y + 0,  z + 1] }
                            );

                            let l = vertices.length;
                            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; //[0,1,2,2,1,3];
                            for(var it of t) vIndex.push(it);

                            

                            //console.log(x,y,z, "front" ,  vertices[l-1].pos ,  vertices[l-2].pos, vertices[l-3].pos, vertices[l-4].pos);


                        }

                        if(!right)
                        {
                            vertices.push(
                                { pos: [ x + 1, y + 0,  z + 1], norm: [ x + 1,  y + 0,  z + 0] },
                                { pos: [ x + 1, y + 0, z + 0], norm: [ x + 1,  y + 0,  z + 0] },
                                { pos: [ x + 1, y + 1,  z + 1], norm: [ x + 1,  y + 0,  z + 0] },
                                { pos: [ x + 1, y + 1, z + 0], norm: [ x + 1,  y + 0,  z + 0]}
                            );
                
                            let l = vertices.length;
                            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; // [4,5,6,6,5,7];
                            for(var it of t) vIndex.push(it);


                            //console.log(x,y,z, "right" ,  vertices[l-1].pos ,  vertices[l-2].pos, vertices[l-3].pos, vertices[l-4].pos);

                        }

                        if(!back)
                        {

                            vertices.push(
                                { pos: [ x + 1, y + 0, z + 0], norm: [ x + 0,  y + 0, z + -1] },
                                { pos: [ x + 0, y + 0, z + 0], norm: [ x + 0,  y + 0, z + -1] },
                                { pos: [ x + 1,  y + 1, z + 0], norm: [ x + 0,  y + 0, z + -1] },
                                { pos: [ x + 0,  y + 1, z + 0], norm: [ x + 0,  y + 0, z + -1]  }
                            );
                
                            let l = vertices.length;
                            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; // [8,9,10,10,9,11];
                            for(var it of t) vIndex.push(it);

                            

                            //console.log(x,y,z, "back" ,  vertices[l-1].pos ,  vertices[l-2].pos, vertices[l-3].pos, vertices[l-4].pos);

                        }

                        if(!left)
                        {
                            vertices.push(
                                { pos: [ x + 0, y + 0, z + 0], norm: [ x + -1,  y + 0,  z + 0] },
                                { pos: [ x + 0, y + 0,  z + 1], norm: [ x + -1,  y + 0,  z + 0] },
                                { pos: [ x + 0, y + 1, z + 0], norm: [ x + -1,  y + 0,  z + 0] },
                                { pos: [ x + 0, y + 1,  z + 1], norm: [ x + -1,  y + 0,  z + 0] }
                            );
                
                            let l = vertices.length;
                            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; // [12,13,14,14,13,15];
                            for(var it of t) vIndex.push(it);


                            //console.log(x,y,z, "left" ,  vertices[l-1].pos ,  vertices[l-2].pos, vertices[l-3].pos, vertices[l-4].pos);

                        }
                        if(!top)
                        {

                            vertices.push(
                                { pos: [  x + 1,  y + 1, z + 0], norm: [  x + 0,  y + 1,  z + 0] },
                                { pos: [ x + 0,  y + 1, z + 0], norm: [  x + 0,  y + 1,  z + 0] },
                                { pos: [  x + 1,  y + 1,  z + 1], norm: [  x + 0,  y + 1,  z + 0] },
                                { pos: [ x + 0,  y + 1,  z + 1], norm: [  x + 0,  y + 1,  z + 0] }
                            );
                
                
                            let l = vertices.length;
                            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; // [16,17,18,18,17,19];
                            for(var it of t) vIndex.push(it);

                            

                            //console.log(x,y,z, "top" ,  vertices[l-1].pos ,  vertices[l-2].pos, vertices[l-3].pos, vertices[l-4].pos);

                
                        }
                        if(!bottom)
                        {
                            
                            vertices.push(
                                { pos: [  x + 1, y + 0,  z + 1], norm: [  x + 0, y + -1,  z + 0] },
                                { pos: [ x + 0, y + 0,  z + 1], norm: [  x + 0, y + -1,  z + 0] },
                                { pos: [  x + 1, y + 0, z + 0], norm: [  x + 0, y + -1,  z + 0] },
                                { pos: [ x + 0, y + 0, z + 0], norm: [  x + 0, y + -1,  z + 0] }
                            );
                
                            let l = vertices.length;
                            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; // [20,21,22,22,21,23];
                            for(var it of t) vIndex.push(it);
                            


                            //console.log(x,y,z, "bottom" ,  vertices[l-1].pos ,  vertices[l-2].pos, vertices[l-3].pos, vertices[l-4].pos);

                        }

                    }
                }
            }
        }

        const positions = [];
        const normals = [];
        for (const vertex of vertices) {
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
        }

        const geometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));

        geometry.setIndex( vIndex);

        const material = new THREE.MeshPhongMaterial({color : this._mColor });

        
        //var wireframe = new THREE.WireframeGeometry( geometry );
        //let line = new THREE.LineSegments( wireframe );
        

        return {
            geometry,
            material,
        };
    }


    getColor(value)
    {
        let color;
        switch(value)
        {
            case 0:
                break;
            case 1:
                // grass
                color = 0x00C613;
                break;
            case 2:
                // dirt
                color = 0xF2C900;
                break;
            case 3:
                // stone
                color = 0x544600;
                break;
            case 4:
                // wood
                color = 0x772B00;
                break;
            case 5:
                // sand
                color = 0xF0F400;
                break;
            case 6:
                // water
                color = 0x009FF4;
                break;

        }

        return color;
    }


    boxDispose()
    {
        let scene = this._mCore._mScene.tObject();
        if(this._mWireMeh)
        {
            scene.remove(this._mWireMeh);
            this._mWireMeh.geometry.dispose();
            this._mWireMeh.material.dispose();
            this._mWireMeh = undefined;

        }

        if(this._mSelfCube)
        {
            scene.remove(this._mSelfCube);
            this._mSelfCube.geometry.dispose();
            this._mSelfCube.material.dispose();
            this._mSelfCube = undefined;
        }
    }

    active(flag)
    {
        if(flag && !this._mbActive)
        {
            this._mbActive = flag;
            if( this._mCore._mTestBoxGeo ) this.boxGeometry();
            this.makeMash();
        }
        else if(!flag && this._mbActive)
        {
            this._mbActive = flag;
            this.boxDispose();
        }
    }

    setHeight(x,z,value)
    {
        for(var i =0; i < value; ++i)
        {
            this._mCells[x][i][z] = 1;
        }
    }



}

export default chunk;