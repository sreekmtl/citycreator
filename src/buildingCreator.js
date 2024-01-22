import * as THREE from 'three';

const buildingData= require('../dist/assets/buildings.json');
console.log(buildingData);

function createBuildings(scene, midPoint, pixSize, origin,data,imgWidth,imgHeight){

    const extrudeSettings = {
        steps: 10,
        depth: 5,
        bevelEnabled: false,
    };     

    var features= buildingData.features;

    for (let i=0; i<features.length;i++){

        var coordinateList=[];

        var coord= features[i].geometry.coordinates;
        
        for (let j=0; j<coord.length; j++){

            var ia= coord[j];

            for (let k=0; k<ia.length;k++){
                
                var lt= ia[k][0];
                var lg= ia[k][1];

                var point= new THREE.Vector2((lt-midPoint[0])/pixSize[0],(lg-midPoint[1])/pixSize[0]);
                coordinateList.push(point);


            }

        }

        var pixPos= [(coordinateList[0].x*pixSize[0])+midPoint[0], (coordinateList[0].y*pixSize[0])+midPoint[1] ];

        var shp= new THREE.Shape(coordinateList);
        var baseHeight= fitToGround(coordinateList[0],pixPos, scene,origin,pixSize,data,imgWidth,imgHeight, false);
        
        const gmtry= new THREE.ExtrudeGeometry(shp,extrudeSettings);
        const material= new THREE.MeshPhongMaterial({ color: "red" });
        const mesh1= new THREE.Mesh(gmtry,material);
        mesh1.castShadow=true;
        mesh1.receiveShadow=true;
        mesh1.position.setZ(baseHeight);

        scene.add(mesh1);

        
    }


}

function fitToGround(basePoint,pixPos,scene,origin,pixSize,data,imgWidth,imgHeight, rc){

    if (rc===true){
        var rc=  new THREE.Raycaster();
            rc.set(new THREE.Vector3(basePoint.x, basePoint.y, 0), new THREE.Vector3(0,0,1));
            rc.near=0.5;
            rc.far=5000;
            var inter= rc.intersectObjects(scene.children);
            //console.log(inter);
            
            if (inter[0].distance){
                //console.log(inter[0]);
                return inter[0].distance;
            }

    }else {

        //console.log(pixPos,"pixpos");
        // finding pix value from position and that pix value is height which we return from here...

        var lat_offset= pixPos[0]-origin[0];
        var lng_offset= pixPos[1]-origin[1];

        var x_pos= Math.floor(lat_offset/pixSize[0]);
        var y_pos= Math.floor(lng_offset/pixSize[1]);

        //pix pos is (width*y_pos)+x_pos

        var ht= data[0][(imgWidth*y_pos)+x_pos];

        //console.log(ht);


        return ht/10.4;

    }


            
    
}

export {createBuildings};