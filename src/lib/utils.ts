
import { Box3, Scene, Vector3, PerspectiveCamera, Group, AmbientLight, WebGLRenderer, Camera} from "three"

import * as TrackballControls from 'three-trackballcontrols'

export function initializeRenderer(
    {
        renderingDiv,
        scene,
        camera,
        controls,
        registeredRenderLoopActions,
        viewerInstance,
        fit
    }:
    {
        renderingDiv: HTMLDivElement,
        scene: Scene,
        camera?: PerspectiveCamera,
        controls?: TrackballControls,
        registeredRenderLoopActions?:  {[key:string]: {action:(Module)=>void, instance: unknown}},
        viewerInstance?: unknown,
        fit?: boolean
    }){
        
    if(!registeredRenderLoopActions)
        registeredRenderLoopActions = {}

    if(fit==undefined)
        fit = false

    const canvas = document.createElement('canvas');
    var context = canvas.getContext('webgl2', { alpha: false });
    let renderer = new WebGLRenderer({ canvas, context, antialias: true });
    renderer.setSize(renderingDiv.clientWidth, renderingDiv.clientHeight);

    if (renderingDiv.children.length == 0)
        renderingDiv.appendChild(renderer.domElement);

    let animate = () => {
        requestAnimationFrame(animate);
        Object.values(registeredRenderLoopActions).forEach(({ action, instance }) => action.bind(instance)(viewerInstance))
        controls.update();
        renderer.render(scene, camera);
    }
    animate()
    if(fit){
        fitSceneToContent(scene, camera, controls)
    }
    return renderer
}

export function fitSceneToContent(scene: Scene, camera: PerspectiveCamera, controls : TrackballControls) {
    
    const selection = scene.children.filter( c => c['geometry'] )
    const fitRatio  =  1.2

    const pcamera  = camera
    const box = new Box3()
    
    selection.forEach( (mesh: any) => {
        box.expandByObject(mesh)
    })
    const size   = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())

    const maxSize = Math.max(size.x, size.y, size.z)
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * pcamera.fov) / 360))
    const fitWidthDistance = fitHeightDistance / pcamera.aspect
    const distance = fitRatio * Math.max(fitHeightDistance, fitWidthDistance)

    const direction = controls.target
      .clone()
      .sub(camera.position)
      .normalize()
      .multiplyScalar(distance)

    controls.maxDistance = distance * 10
    controls.target.copy(center)
    pcamera.near = distance / 100
    pcamera.far = distance * 100
    pcamera.updateProjectionMatrix()
    camera.position.copy(controls.target).sub(direction)

    controls.update()
}

export function createDefaultLights(intensity ) {
    const g = new Group()
    g.add( new AmbientLight(0xffffff, intensity) )
    return g
}
