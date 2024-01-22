import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

function loadBuildings(scene,terrain){

    let isLoaded=false;

    const loader= new OBJLoader();

    loader.load('./assets/ddn8.obj', function (object) {

        console.log(object);
        
        

        for (let i=0; i<object.children.length;i++){
            object.children[i].geometry.scale(0.1,0.1,0.2);
        }
        var intersects=[];
        
        for (let i=0; i<100;i++){
            object.children[i].geometry.computeBoundingBox();
            var centroid= new THREE.Vector3();
            centroid.addVectors(object.children[i].geometry.boundingBox.min, object.children[i].geometry.boundingBox.max);
            centroid.multiplyScalar(0.5);
            //centroid.applyMatrix4(terrain.matrixWorld);
            //console.log(centroid,"centroid");
            //console.log(object.children[i].geometry.attributes.position,"pos");

            var rc=  new THREE.Raycaster();
            rc.set(centroid, new THREE.Vector3(0,0,1));
            rc.near=0.5;
            rc.far=5000;
            var inter= rc.intersectObjects(scene.children);
            intersects.push(inter);
            if (inter[0].distance){
                //console.log(inter[0]);
                object.children[i].position.setZ((inter[0].distance+2));
            }
            
            
            
        }

        

        //console.log(intersects);

      


       // object.updateMatrix();
        //object.position.setZ(100);

       

        //var vertices_array= object.children;//[1].geometry.attributes.position.array;
        //console.log(vertices_array);

        //var vertexObj= vertices_array[0].geometry.attributes;
        //console.log(object);

        for (let i=0; i<object.children.length;i++){
            scene.add(object.children[i]);
        }
        

        //scene.add(object);


    }, function (xhr){
        console.log((xhr.loaded/xhr.total*100)+"% loaded");
    }, function (error){
        console.log("An error occured", error);
    });
    

}

function fixToGround(){

    

}

export {loadBuildings};