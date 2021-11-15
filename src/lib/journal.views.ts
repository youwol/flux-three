import { BufferGeometry, Color, Mesh, MeshStandardMaterial,  Object3D,  PerspectiveCamera, Points, PointsMaterial, Scene, WebGLRenderer } from "three";
import { createDefaultLights, initializeRenderer } from "./utils";

import * as TrackballControls from 'three-trackballcontrols'


function createSceneWithObject(obj: Object3D, renderingDiv: HTMLDivElement){

    let camera = new PerspectiveCamera(70, renderingDiv.clientWidth / renderingDiv.clientHeight, 0.01, 1000)
    camera.position.z = 10
    
    let scene = new Scene()
    scene.background = new Color(0xFFFFFF);    
    scene.add(obj);                    
    renderingDiv.parentNode["threeScene"] = scene  
    try{
    scene.add(createDefaultLights([new AmbientLight(0xffffff, 0.5)]))
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

function headerView(geometry: BufferGeometry){

    return {
        innerText:`Vertexes count: ${geometry.getAttribute('position').count}`
    }
}

export function object3DJournalView(object: Object3D ){

    return {
        class:'d-flex flex-column',
        style:{width:'500px', height:'500px'},
        children:[
            object['geometry'] ? headerView(object['geometry']) : {},
            {
                class:"flex-grow-1", style:{'min-height': '0px'},
                connectedCallback: (renderingDiv: HTMLDivElement) => {
                        
                    createSceneWithObject(object.clone(), renderingDiv)
                }
            }
        ]
    }
}


export function geometryJournalView(geometry: BufferGeometry ) {

    return {
        class:'d-flex flex-column',
        style:{width:'500px', height:'500px'},
        children:[
            headerView(geometry),
            {
                class:"flex-grow-1", style:{'min-height': '0px'},
                connectedCallback: (renderingDiv: HTMLDivElement) => {

                    let object = geometry.getIndex() != undefined
                        ? new Mesh(
                            geometry,
                            new MeshStandardMaterial({ color: 0x3399ff, wireframe: true }))
                        : new Points(geometry,
                            new PointsMaterial({ size: 5, color: 0x3399ff, sizeAttenuation: false }))

                    createSceneWithObject(object, renderingDiv)
                }
            }
        ]
    }
}