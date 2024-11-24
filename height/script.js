


var gJSonData = [];

document.addEventListener("DOMContentLoaded", function()
{

    const x = 16;
    const z = 16;
    const worldCell = 32;
    const worldHeight = 64;

    const c = document.getElementById("canvas");
    const ctx = c.getContext('2d');

    const imgURL = './h1.png';
    const imgData = new Image();
    imgData.src = imgURL;

    window.onload = function(event)
    {
        let { width, height } = imgData;
        let sizeWidth = x * worldCell;
        let sizeHeight = z * worldCell;

        ctx.drawImage(imgData,0,0,sizeWidth,sizeHeight);
        var outData = ctx.getImageData(0,0, sizeWidth, sizeHeight).data;

        for( var i = 0; i < sizeWidth * sizeHeight; ++i)
        {
            let count = i * 4;
            let ch = 
            outData[count] + 
            outData[count + 1] + 
            outData[count + 2] ;

            let scale = ch / 765; // 765
            let itValue = this.Math.floor ( scale * worldHeight );

            gJSonData.push(itValue);

        }
        /*
        for( var i = 0; i < outData.length; i +=4 )
        {
            let ch = 
            outData[i] + 
            outData[i + 1] + 
            outData[i + 2] ;

            let scale = ch / 765;
            let itValue = this.Math.round ( scale * worldHeight );

            gJSonData.push(JSON.stringify(itValue));

        
        }
        */
    }


});



function jClick(self)
{
    console.log(JSON.stringify((gJSonData)));
    self.href = "data:text/plain;charset=UTF-8,"  + encodeURIComponent(gJSonData);
}