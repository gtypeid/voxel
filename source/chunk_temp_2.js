
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

        this._mCells = [];
        this._mCubes = [];
        this.init();

    }

    init()
    {
        this._mCore = ut.getSclass(ut.nd.core);


        var myrng = new Math.seedrandom( ut.randomInt(0,33) );

        for( var x = 0 ; x < this._mSizeX; ++x){
            this._mCells.push([]);
            for( var y = 0 ; y < this._mSizeY; ++y){
                this._mCells[x].push([]);
                for( var z = 0 ; z < this._mSizeZ; ++z){
                    this._mCells[x][y].push( ut.seedMixedValue(myrng(),0,7) ); // 
                }

            }
        }

    }

    boxGeometry()
    {
        const {_mX, _mZ} = this;
        let scene = this._mCore._mScene.tObject();

        let geo = new THREE.BoxBufferGeometry( this._mSizeX, 128 ,this._mSizeZ  );
        var wireframe = new THREE.WireframeGeometry( geo );
        let line = new THREE.LineSegments( wireframe );
        line.material.color.setHex("0xffffff");
        line.material.opacity = 1;

        line.position.set( (_mX * -(this._mSizeX * 2) )+0, 0, (_mZ * -(this._mSizeZ * 2) ) + 0 );
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
        let scene = this._mCore._mScene.tObject();

        for( var x = 0 ; x < this._mSizeX; ++x)
        {
            for( var y = 0 ; y < this._mSizeY; ++y)
            {
                for( var z = 0; z < this._mSizeZ; ++z)
                {
                    let { bFlag , cell} = this.getIsCell(x,y,z);
                    if(bFlag && cell !== 0)
                    {
                        let {geometry,material} = this.buffer(x,y,z,cell); // this.buffer(false,false,false,false,false,false,false);    

                        //material.wireframe = true;
                        let cube = new THREE.Mesh(geometry,material);
                        const mx = this._mX;
                        const mz = this._mZ;

                        cube.position.set(  (-mx * (this._mSizeX *2) ) - ((this._mSizeX * 2) / 2) + ( x * 2) , 
                                                    ( y * 2) ,
                                            (-mz * (this._mSizeZ *2) ) - ((this._mSizeZ * 2) / 2) + ( z * 2) ,
                                        );

                        scene.add(cube);
                        this._mCubes.push(cube);


                    }

                }
            }
        }

        console.log( this._mX, this._mZ);

    }

    buffer(x,y,z,cell)
    {
        // air라고 간주된다면
        let front = this.isbCell(x,y,z+1);
        let right = this.isbCell(x+1,y,z);
        let back = this.isbCell(x,y,z-1);
        let left = this.isbCell(x-1,y,z);
        let top = this.isbCell(x,y+1,z);
        let bottom = this.isbCell(x,y-1,z);


        let vertices = [];
        let vIndex = [];
        // append
        if(!front)
        {
            vertices.push(
                { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
                { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 1], },
                { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 0], },
                { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 0], }
            );

            let l = vertices.length;
            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; //[0,1,2,2,1,3];
            for(var it of t) vIndex.push(it);
        }
        if(!right)
        {
            vertices.push(
                { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
                { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
                { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
                { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 0], }
            );

            let l = vertices.length;
            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; // [4,5,6,6,5,7];
            for(var it of t) vIndex.push(it);
        }
        if(!back)
        {
            vertices.push(
                { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
                { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
                { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
                { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 0], }
            );

            let l = vertices.length;
            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; // [8,9,10,10,9,11];
            for(var it of t) vIndex.push(it);
        }

        if(!left)
        {
            vertices.push(
                { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 1], },
                { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 1], },
                { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 0], },
                { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 0], }
            );

            let l = vertices.length;
            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; // [12,13,14,14,13,15];
            for(var it of t) vIndex.push(it);
        }
        if(!top)
        {
            vertices.push(
                { pos: [ 1,  1, -1], norm: [ 0,  1,  0],  },
                { pos: [-1,  1, -1], norm: [ 0,  1,  0],  },
                { pos: [ 1,  1,  1], norm: [ 0,  1,  0],  },
                { pos: [-1,  1,  1], norm: [ 0,  1,  0],  }
            );


            let l = vertices.length;
            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; // [16,17,18,18,17,19];
            for(var it of t) vIndex.push(it);

        }
        if(!bottom)
        {
            vertices.push(
                { pos: [ 1, -1,  1], norm: [ 0, -1,  0],  },
                { pos: [-1, -1,  1], norm: [ 0, -1,  0],  },
                { pos: [ 1, -1, -1], norm: [ 0, -1,  0],  },
                { pos: [-1, -1, -1], norm: [ 0, -1,  0],  }
            );

            let l = vertices.length;
            let t = [l-4, l-3, l-2, l-2, l-3, l-1]; // [20,21,22,22,21,23];
            for(var it of t) vIndex.push(it);
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


        const material = new THREE.MeshPhongMaterial({color : this.getColor(cell) });

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

        if(this._mCubes.length != 0)
        {
            for( var i = 0 ; i < this._mCubes.length; ++i)
            {
                scene.remove(this._mCubes[i]);
                this._mCubes[i].geometry.dispose();
                this._mCubes[i].material.dispose();
                this._mCubes[i] = undefined;
            }
        }
    }

    active(flag)
    {
        if(flag && !this._mbActive)
        {
            this._mbActive = flag;
            this.boxGeometry();
            this.makeMash();
        }
        else if(!flag && this._mbActive)
        {
            this._mbActive = flag;
            this.boxDispose();
        }
    }



}

export default chunk;