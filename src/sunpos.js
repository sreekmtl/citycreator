import * as THREE from 'three';
var SunCalc = require('suncalc');

function getSunPosition(dateUTC){

    var date= new Date(dateUTC);
    var posParams= SunCalc.getPosition(date,30.3, 77.9);
    var azimuth= posParams.azimuth* (180/Math.PI);
    var solarAltitue= posParams.altitude* (180/Math.PI);
    console.log(date, posParams,azimuth, solarAltitue);

    var correctedAzimuth= 180+azimuth;

    return {correctedAzimuth, solarAltitue};

}

function getLightPosition(light, dateUTC){

    var params= getSunPosition(dateUTC);
    var lightPosition= light.position.set(0,3000,0);
    console.log(params, lightPosition);

    //to find azimuth, multiplying horizon position of sun vector (def north up) with 2*2 rotation matrix

    var rotatedAzimuth_x= (lightPosition.x*Math.cos(params.correctedAzimuth*Math.PI/180))+ (lightPosition.y*Math.sin(params.correctedAzimuth*Math.PI/180));
    var rotatedAzimuth_y= (-lightPosition.x*Math.sin(params.correctedAzimuth*Math.PI/180))+ (lightPosition.y*Math.cos(params.correctedAzimuth*Math.PI/180));

    //var newAzim= new THREE.Vector3(rotatedAzimuth_x,rotatedAzimuth_y,0);

    var newAlt= new THREE.Vector3();
    newAlt.copy(lightPosition);

    var alt_matrix= new THREE.Matrix4().makeRotationX((params.solarAltitue)*Math.PI/180);
    newAlt.applyMatrix4(alt_matrix);
    console.log(newAlt);

    var azim_matrix= new THREE.Matrix4().makeRotationZ((360-params.correctedAzimuth)*Math.PI/180);
    var newPos= newAlt.applyMatrix4(azim_matrix);
    console.log(newPos, "newpos");

  return newPos;


}

export {getLightPosition};