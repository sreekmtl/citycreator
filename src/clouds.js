import * as THREE from 'three';

function loadClouds(scene){

    let cloudGeometry= new THREE.BoxGeometry(100,200,10,20);
    const cloudMaterial= new THREE.MeshPhongMaterial({
        wireframe:false,
        color:"white",
        transparent:true,
        opacity:0.1,
        side:THREE.DoubleSide,
    });

    const cloudMesh= new THREE.Mesh(cloudGeometry,cloudMaterial);
    cloudMesh.position.y=0;
    cloudMesh.position.setZ(400);
    cloudMesh.castShadow=true;
    cloudMesh.receiveShadow=true;
    scene.add(cloudMesh);


}

export {loadClouds};