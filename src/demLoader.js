import * as GEOTIFF from 'geotiff';

async function loadDEM(){
    const tiff= await GEOTIFF.fromUrl('./assets/ddn_utm43n.tif');
    const image= await tiff.getImage();
    const origin= image.getOrigin();
    const pixSize= image.getResolution();
    const imgWidth= image.getWidth();
    const imgHeight= image.getHeight();
    const data= await image.readRasters();
    console.log(data);

    return {
        width: imgWidth,
        height: imgHeight,
        origin: origin,
        pixSize: pixSize,
        data: data
    }

}

export {loadDEM}