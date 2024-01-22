import * as THREE from 'three';
import * as GEOTIFF from 'geotiff';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadBuildings } from './buildingLoader';
import { loadClouds } from './clouds';
import { createBuildings } from './buildingCreator';
import { getLightPosition, getSunPosition } from './sunpos';
//import '../styles/style.css';


//CREATING DOM ELEMENT FOR RENDERING THE SCENE

let divElement= document.createElement('div');
divElement.id='viz';
document.body.appendChild(divElement);


function renderScene(terrainMesh,origin, midPoint, pixSize, data,imgWidth,imgHeight){

    const scene= new THREE.Scene();
    var light= new THREE.PointLight(0xffffff,3e7,1e4);
    light.castShadow=true;
    light.position.set(0,0,3000);
    scene.add(light);

    const displayText= document.getElementById("displayText");
    const sunSlider= document.getElementById('sunslider');
    sunSlider.addEventListener("input", (event)=>{

        var content= `January 20, 2023 ${event.target.value}:00:00 GMT+5:30`;
        displayText.textContent= content;
        var lp= getLightPosition(light,content);
        light.position.set(lp.x,lp.y,lp.z); //default light position
        light.updateMatrixWorld();

    });
 
    
    scene.add(terrainMesh);

    //getLightPosition(light,"June 20, 2022 1:00:00 GMT+5:30");

    

    var camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.set(1000,1000,1000);
    camera.lookAt(scene.position);

    const renderer= new THREE.WebGLRenderer({
        antialias:true, 
        powerPreference: "high-performance"
    });
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    document.getElementById('viz').appendChild(renderer.domElement);

    var axesHelper = new THREE.AxesHelper(1000); // The parameter is the size of the axes
    scene.add(axesHelper);
    //loadBuildings(scene,terrainMesh);
    //loadClouds(scene);
    createBuildings(scene, midPoint,pixSize,origin, data,imgWidth,imgHeight);

    // Add camera controls
    var controls= new OrbitControls(camera, renderer.domElement);
    controls.target.set(0,0,0);
    //controls.minDistance=6385;
    //controls.maxDistance=40000;
    controls.enableDamping=true;
    controls.dampingFactor=0.05;
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    };

    (function animate() {
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    })();


}

function createTerrain(imgWidth, imgHeight, origin, pixSize, data){

    let planeGeometry= new THREE.PlaneGeometry((imgWidth*pixSize[0]/10), (imgHeight*pixSize[0]/10.4), imgWidth-1, imgHeight-1);
    
    const arr1= new Array(planeGeometry.attributes.position.count);
    const arr= arr1.fill(1);
    console.log(data[0][1]);
    arr.forEach((a,index)=>{
        planeGeometry.attributes.position.setZ(index, (data[0][index]/10*1));
    
    });

    console.log(planeGeometry.attributes.position.getZ(500),"dddd");

    const texture= new THREE.TextureLoader().load('./assets/ddns2utm43.png');
    const material= new THREE.MeshLambertMaterial({
        wireframe:false,
        
        map: texture,
    })

    const terrainMesh= new THREE.Mesh(planeGeometry, material);
    //terrainMesh.position.y=-1015;
    //terrainMesh.position.x=845
    terrainMesh.receiveShadow=true;

    const midPoint= [(Math.floor(imgWidth/2)*pixSize[0]+origin[0]),(Math.floor(imgHeight/2)*pixSize[1]+origin[1]) ];
    console.log("midpoint", midPoint);

    renderScene(terrainMesh,origin, midPoint, pixSize, data,imgWidth,imgHeight);


}

async function loadDEM(){
    const tiff= await GEOTIFF.fromUrl('./assets/ddn_utm43n.tif');
    const image= await tiff.getImage();
    const origin= image.getOrigin();
    const pixSize= image.getResolution();
    console.log(pixSize);
    console.log(image.getOrigin());
    const imgWidth= image.getWidth();
    const imgHeight= image.getHeight();
    const data= await image.readRasters();
    console.log(data);

    createTerrain(imgWidth, imgHeight, origin, pixSize, data);

}

//move this dem loading to new js file so variables can be accessed easilty w/o copying into memory

loadDEM();
