import { loadDEM } from './demLoader';
import { createTerrain } from './terrain';
import '../styles/myStyles.css'


function init(){

    loadDEM().then((value)=>{

        createTerrain(value);
        
    });


}

init();
