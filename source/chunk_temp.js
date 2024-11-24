
import * as THREE from '../lib/three.module.js';
import * as ut from './util.js';


import iBlock from './block.js';
import core from './core.js';



 

class chunk
{
    constructor()
    {
        this._mCellSize;
        this._mCellSliceSize;
        this._mCells;

        this._mCore;

        this._mMat;
        this.init();
    }

    init()
    {
        const size = 16;

        this._mCellSize = size;
        this._mCellSliceSize = this._mCellSize * this._mCellSize;
        this._mCells = new Uint8Array(size * size * size);

        this._mCore = ut.getSclass(ut.nd.core);

        this.setRnad();
        this.createChunkMeshs();


    }

    isCell(x,y,z)
    {
        const {_mCellSize} = this;
        const cellX = Math.floor(x / _mCellSize);
        const cellY = Math.floor(y / _mCellSize);
        const cellZ = Math.floor(z / _mCellSize);
        if (cellX !== 0 || cellY !== 0 || cellZ !== 0) {
        return null;
        }

        return this._mCells;
    }

    
    forCellOffset(x, y, z) {
        const {_mCellSize, _mCellSliceSize} = this;
        const voxelX = THREE.Math.euclideanModulo(x, _mCellSize) | 0;
        const voxelY = THREE.Math.euclideanModulo(y, _mCellSize) | 0;
        const voxelZ = THREE.Math.euclideanModulo(z, _mCellSize) | 0;
        return voxelY * _mCellSliceSize +
            voxelZ * _mCellSize +
            voxelX;
    }

    getCell(x,y,z)
    {
        const cells = this.isCell(x,y,z);
        if(!cells) return 0;
        
        const cellOffset = this.forCellOffset(x,y,z);

        return cells[cellOffset];
    }

    setRnad()
    {
        let { _mCellSize } = this;
        let count = 0;
        var myrng = new Math.seedrandom(33);

        for( var x = 0 ; x < _mCellSize; ++x)
        {
            for ( var y = 0 ; y < _mCellSize; ++y)
            {
                for (var z = 0; z < _mCellSize; ++z)
                {
                    this._mCells[count] = 1;  //ut.seedMixedValue(myrng(),0,10);
                    count++;

                }
            }
        }
    }

    createChunkMeshs()
    {
        const {_mCellSize} = this;
        let scene = this._mCore._mScene.tObject();
        
        let { geometry, material } = this.createBufferGeometry();
        this._mMat = material;

        const le = 2.0;
        const c = 0;
        const plusX = 0;
        const plusZ = 0;
        for( var x = 0 ; x < _mCellSize; ++x)
        {
            for ( var y = 0 ; y < _mCellSize; ++y)
            {
                for (var z = 0; z < _mCellSize; ++z)
                {
                    let cell = this.getCell(x,y,z);
                    if(cell && !this.isOptive(x,y,z))
                    {
                        let cube = new THREE.Mesh(geometry,material);
                        cube.position.set( (x * le), 
                                        (y * le) ,
                                        (c* 64 ) + (z * le),
                                        );

                        scene.add(cube);

                    }

                }
            }
        }
        let wireframe = new THREE.WireframeGeometry( geometry );
        let line = new THREE.LineSegments( wireframe );
        line.material.color.setHex("0xffffff");
        line.material.opacity = 1;

        line.scale.set(20,20,20);
        line.position.set(15,15,15);
        scene.add( line );


    }

    createBufferGeometry()
    {
        const vertices = [
            // front
            { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
            { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 1], },
            { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 0], },

            //{ pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 0], },
            //{ pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 1], },
            { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 0], },

            // right
            { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
            { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
            { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 0], },

            //{ pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
            //{ pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
            { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 0], },

            // back
            { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
            { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
            { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 0], },

            //{ pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
            //{ pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
            { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 0], },

            // left
            { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 1], },
            { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 1], },
            { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 0], },

            //{ pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 0], },
            //{ pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 1], },
            { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 0], },

            // top
            { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 1], },
            { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 1], },
            { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 0], },

            //{ pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 0], },
            //{ pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 1], },
            { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 0], },

            // bottom
            { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 1], },
            { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 1], },
            { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 0], },

            //{ pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 0], },
            //{ pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 1], },
            { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 0], },
        ];
        
        const positions = [];
        const normals = [];
        const uvs = [];
        for (const vertex of vertices) {
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
        }

        const geometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        geometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
            



        geometry.setIndex(
            [   0,1,2,      2,1,3,      // front
                4,5,6,      6,5,7,      // right
                8,9,10,     10,9,11,    // back
                12,13,14,   14,13,15,   // left
                16,17,18,   18,17,19,   // top
                20,21,22,   22,21,23    // bottom 
            ]
        )
        


        const loader = new THREE.TextureLoader();
        //const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');
        const material = new THREE.MeshPhongMaterial({color : 0x00D889});


        return {
            geometry,
            material,
        };

        //cb(geometry , material);
    
    }


    isOptive(x,y,z)
    {
        let bFlag = false;
        const r = this.getCell(x + 1,y,z);
        const l = this.getCell(x -1, y, z);
        const f = this.getCell(x,y,z +1);
        const b = this.getCell(x,y,z-1);
        const u = this.getCell(x,y+1,z);
        const d = this.getCell(x,y-1,z);

        if(r && l && f && b && u && d)
        {
            bFlag = true;
        }

        return bFlag;
    }

}

export default chunk;