import { BufferGeometry, Color, Mesh, MeshStandardMaterial,  PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { createDefaultLights, initializeRenderer } from "./utils";

import * as TrackballControls from 'three-trackballcontrols'


export function geometryJournalView(geometry: BufferGeometry | Mesh) {
    
    return {
        style:{width:'500px', height:'500px'},
        children:[
            {
                class:"h-100 v-100",
                connectedCallback: (renderingDiv: HTMLDivElement) => {

                    let mesh = geometry instanceof Mesh 
                        ? geometry
                        : new Mesh(
                            geometry, 
                            new MeshStandardMaterial({ color: 0x3399ff, wireframe:true })
                        )
                    let camera = new PerspectiveCamera(70, renderingDiv.clientWidth / renderingDiv.clientHeight, 0.01, 1000)
                    camera.position.z = 10
                    
                    let scene = new Scene()
                    scene.background = new Color(0xFFFFFF);    
                    scene.add(mesh);                    
                    scene.add(createDefaultLights(0.5)) 
                    renderingDiv.parentNode["threeScene"] = scene  
                    try{
                        initializeRenderer({
                            controls: new TrackballControls(camera, renderingDiv),
                            camera,
                            scene,
                            renderingDiv,
                            registeredRenderLoopActions:{},//rotation: { action: ()=>mesh.rotation.y += 0.01, instance:undefined}},
                            fit: true
                        })  
                    }
                    catch(e){
                        console.error("Render initialization failed")
                    }
                }
            }
        ]
    }
}