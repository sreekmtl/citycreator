import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadBuildings } from './buildingLoader';
import { createBuildings } from './buildingCreator';
import { getLightPosition, getSunPosition } from './sunpos';


//CREATING DOM ELEMENT FOR RENDERING THE SCENE

let divElement= document.createElement('div');
divElement.id='viz';
document.body.appendChild(divElement);


function renderScene(terrainMesh,midPoint,dem){

    const scene= new THREE.Scene();
    var light= new THREE.PointLight(0xffffff,3e7,1e4);
    //var light= new THREE.DirectionalLight(0xffffff);
    light.castShadow=true;
    light.position.set(0,0,3500);
    scene.add(light);

    

    const displayText= document.getElementById("displayText");
    const sunSlider= document.getElementById('sunslider');
    displayText.value="January 23, 2023 12:00:00 GMT+5:30";
    const dateBtn= document.getElementById("dateSubmit")

    dateBtn.addEventListener("click",(event)=>{
        var content= displayText.value;
        var lp= getLightPosition(light,content);
        light.position.set(lp.x,lp.y,lp.z); //default light position
        light.updateMatrixWorld();
        
        var timeComp= content.split(' ')[3];
        var hrComp= timeComp.split(':')[0];
        sunSlider.value=hrComp;


    });
    
    sunSlider.addEventListener("input", (event)=>{

        //var content= `January 23, 2023 ${event.target.value}:00:00 GMT+5:30`;
        var content= displayText.value;
        var txtComp= content.split(' ');
        var hot= txtComp[3].split(':');

        hot= event.target.value;


        displayText.value= txtComp[0]+" "+txtComp[1]+" "+txtComp[2]+" "+hot+":00:00"+" "+txtComp[4];
        var lp= getLightPosition(light,content);
        light.position.set(lp.x,lp.y,lp.z); //default light position
        light.updateMatrixWorld();

    });
 
    
    scene.add(terrainMesh);

    //getLightPosition(light,"June 20, 2022 1:00:00 GMT+5:30");

    

    var camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.set(0,-500,900);
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

    //var axesHelper = new THREE.AxesHelper(1000); // The parameter is the size of the axes
    //scene.add(axesHelper);
    createBuildings(scene, midPoint,dem);

    // Add camera controls
    var controls= new OrbitControls(camera, renderer.domElement);
    controls.target.set(0,0,0);
    //controls.minDistance=6385;
    //controls.maxDistance=40000;
    controls.enableDamping=true;
    controls.dampingFactor=0.05;
    controls.zoomSpeed=2;
    controls.rotateSpeed=1.5;
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

function createTerrain(dem){

    let planeGeometry= new THREE.PlaneGeometry(dem.width, dem.height, dem.width-1, dem.height-1);
    
    const arr1= new Array(planeGeometry.attributes.position.count);
    const arr= arr1.fill(1);
    
    arr.forEach((a,index)=>{
        planeGeometry.attributes.position.setZ(index, (dem.data[0][index]/10*1));
    
    });

    console.log(planeGeometry.attributes.position.getZ(500),"dddd");

    const texture= new THREE.TextureLoader().load('./assets/ddns2utm43.png');
    const material= new THREE.MeshLambertMaterial({
        wireframe:false,
        
        map: texture,
    })

    const terrainMesh= new THREE.Mesh(planeGeometry, material);
    terrainMesh.receiveShadow=true;

    const midPoint= [(Math.floor(dem.width/2)*dem.pixSize[0]+dem.origin[0]),(Math.floor(dem.height/2)*dem.pixSize[1]+dem.origin[1]) ];
    console.log("midpoint", midPoint);

    renderScene(terrainMesh,midPoint,dem);


}

export {createTerrain};
