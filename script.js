
import iCore from './source/core.js';



document.addEventListener("DOMContentLoaded", function()
{
    var core = new iCore();


    core.run();

    document.getElementsByClassName("all-view")[0].addEventListener("click", function(event){
        if(core._mTestAllRender)
            core._mTestAllRender = false;
        else core._mTestAllRender = true;
        core._mChunkManager.allView(core._mTestAllRender);
    });

    document.getElementsByClassName("wire-mode")[0].addEventListener("click", function(event){
        if(core._mTestWireRender)
            core._mTestWireRender = false;
        else core._mTestWireRender = true;

        core._mChunkManager.allView(false);
        core._mChunkManager.allView(core._mTestAllRender);
    });

    document.getElementsByClassName("box-geo")[0].addEventListener("click", function(event){
        if(core._mTestBoxGeo)
            core._mTestBoxGeo = false;
        else core._mTestBoxGeo = true;

        core._mChunkManager.allView(false);
        core._mChunkManager.allView(core._mTestAllRender);
    });
});