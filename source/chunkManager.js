
import * as THREE from '../lib/three.module.js';
import * as ut from './util.js';

import iChunk from './chunk.js';

class chunkManager
{
    constructor()
    {
        this._mCore;
        this._mCellChunks = []

        this._mWorldCell = 32;
        this._mCellSize = 16;
        this._mCellHeight = 64;
        this._mHeightMapData = [];

        this._mClientX;
        this._mClientY;
        this.init();
    }

    init()
    {
        this._mCore = ut.getSclass(ut.nd.core);
        this.initData();

    }

    initData()
    {   
        const { _mWorldCell , _mCellSize, _mCellHeight } = this;

        
        this.loadHeightMap((data)=>
        {
            this._mHeightMapData = data;

            for( var worldX = 0; worldX < _mWorldCell; ++worldX)
            {
                for ( var worldZ = 0; worldZ < _mWorldCell; ++worldZ)
                {
                    this.chunkActive(worldX,worldZ,false);
                    for( var cellX = 0; cellX < _mCellSize; ++cellX)
                    {
                        for( var cellZ = 0; cellZ < +_mCellSize; ++cellZ)
                        {
                            const value = this.getHeight(worldX, worldZ, cellX, cellZ);
                            if(value != -1)
                            {
                                this._mCellChunks[worldX][worldZ].setHeight(cellX,cellZ,value);
                            }


                        }
                    }

                    this.chunkActive(worldX,worldZ,true);
                    this.chunkActive(worldX,worldZ,false);
                }
            }

            

        });
        

        for( var x = 0 ; x < _mWorldCell; ++x)
        {
            this._mCellChunks.push([]);
            for(var z = 0; z < _mWorldCell; ++z)
            {
                this._mCellChunks[x].push( new iChunk(x,z, _mCellSize, _mCellHeight, _mCellSize) );
            }
        }

        const xz = (_mWorldCell / 2 ) * _mCellSize;

        this._mCore._mController.setPosition( xz, 15, xz);

    }

    updatePlayerPosition(newPosition)
    {
        const { _mCellSize } = this;

        const x = Math.abs ( Math.floor( (newPosition.x / _mCellSize) ) );
        const z = Math.abs ( Math.floor( (newPosition.z / _mCellSize) ) );

        this._mClientX = x;
        this._mClientZ = z;
        


        /*
        for( var cz = -2; cz <=2; cz++)
        {
            for(var cx= -2; cx <= 2; ++cx)
            {
                this.chunkActive( (x + cx), (z + cz),true);
            }
        }

        for( var dx = -3; dx <=3; dx++)
        {
            this.chunkActive( x + dx, (z+3),false);
            this.chunkActive( x + dx, (z-3),false);
        }

        
        for ( var dz = -2; dz<=2; dz++)
        {
            this.chunkActive( (x + 3), z + dz,false);
            this.chunkActive( (x - 3), z - dz,false);
        }

        
        for(var i = -2; i <= 2; ++i)
        {
            this.chunkActive(x + i,z -2,true);
        }

        for(var i = -2; i <= 2; ++i)
        {
            this.chunkActive(x + i,z -1,true);
        }

        for(var i = -2; i <= 2; ++i)
        {
            this.chunkActive(x + i,z,true);
        }

        for(var i = -2; i <= 2; ++i)
        {
            this.chunkActive(x + i,z +1,true);
        }

        for(var i = -2; i <= 2; ++i)
        {
            this.chunkActive(x + i,z +2,true);
        }
        */
        
        if(!this._mCore._mTestAllRender)
        {
        this.chunkActive(x,z,true);
        this.chunkActive(x+1,z,true);
        this.chunkActive(x-1,z,true);
        this.chunkActive(x,z+1,true);
        this.chunkActive(x,z-1,true);
        
        this.chunkActive(x+1,z+1,true);
        this.chunkActive(x+1,z-1,true);
        this.chunkActive(x-1,z+1,true);
        this.chunkActive(x-1,z-1,true);
        
    
        
        this.chunkActive(x,z+2,false);
        this.chunkActive(x+1,z+2,false);
        this.chunkActive(x-1,z+2,false);
        this.chunkActive(x,z-2,false);
        this.chunkActive(x+1,z-2,false);
        this.chunkActive(x-1,z-2,false);
        this.chunkActive(x+2,z,false);
        this.chunkActive(x+2,z+1,false);
        this.chunkActive(x+2,z+2,false);
        this.chunkActive(x+2,z-1,false);
        this.chunkActive(x+2,z-2,false);
        this.chunkActive(x-2,z,false);
        this.chunkActive(x-2,z+1,false);
        this.chunkActive(x-2,z+2,false);
        this.chunkActive(x-2,z-1,false);
        this.chunkActive(x-2,z-2,false);
        }
        
        
        
        
        
        

    }

    chunkActive(x,y,value)
    {
        if(this.isChunk(x,y))
        {
            this._mCellChunks[x][y].active(value);
        }
    }

    isChunk(x,y)
    {
        let bFlag = false;
        if( this._mCellChunks[x] &&
            this._mCellChunks[x][y] )
        {
            bFlag = true;
        }
        return bFlag;
    }


    loadHeightMap( cb )
    {
        const url = '../resource/heightMap-kor.json';

        var xmlhttp = new XMLHttpRequest();
        
        xmlhttp.onreadystatechange = (event)=> 
        {
            const {target} = event;
            if (target.readyState == 4 && target.status == 200) 
                {
                    let str = target.response;
                    let array = str.split(",");
                    let last = [];
                    for (var it of array)
                    {
                        last.push( Number(it));
                    }


                    cb(last);
                }
        };
        
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    }


    getHeight(worldX, worldZ, x, z)
    {
        const {_mCellSize, _mWorldCell } = this;

        const hx = Math.floor(x / _mCellSize);
        const hz = Math.floor(z / _mCellSize);
        let rd = -1;
        if(this.isChunk(worldX,worldZ) && ( hx == 0 && hz == 0 ) )
        {
            const vx = worldX * (_mCellSize); 
            const vz = worldZ * ( ( _mCellSize * _mCellSize ) * _mWorldCell);

            rd = this._mHeightMapData[ ( (z * ( _mWorldCell * _mCellSize) ) + vz) + ( x + vx ) ];
        }

        return rd;
    }

    allView(bFlag)
    {
        const { _mWorldCell , _mCellSize, _mCellHeight } = this;
        for( var worldX = 0; worldX < _mWorldCell; ++worldX)
        {
            for ( var worldZ = 0; worldZ < _mWorldCell; ++worldZ)
            {
                this.chunkActive(worldX,worldZ,bFlag);
            }
        }
    }


}

export default chunkManager;