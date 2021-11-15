
import { Box3, Scene, Vector3, PerspectiveCamera, Group, AmbientLight, WebGLRenderer, Camera, Light } from "three"

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
            registeredRenderLoopActions?: { [key: string]: { action: (Module) => void, instance: unknown } },
            viewerInstance?: unknown,
            fit?: boolean
        }) {

    if (!registeredRenderLoopActions)
        registeredRenderLoopActions = {}

    if (fit == undefined)
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
    if (fit) {
        fitSceneToContent(scene, camera, controls)
    }
    return renderer
}

export function getChildrenGeometries(children) {

    let geometries = children
        .filter(child => child instanceof Group || child['geometry'])
        .map(child => {
            if (child instanceof Group) {
                return getChildrenGeometries(child.children).reduce((acc, e) => acc.concat(e), [])
            }
            return [child]
        })
    return geometries.reduce((acc, e) => acc.concat(e), [])
}

export function fitSceneToContent(scene: Scene, camera: PerspectiveCamera, controls: TrackballControls) {

    let bbox = getSceneBoundingBox(scene)
    let size = bbox.getSize(new Vector3())
    let center = bbox.getCenter(new Vector3())

    if (size.length() == 0)
        return

    const fitRatio = 1.2
    const pcamera = camera

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

export function createDefaultLights(lights: Light[]) {
    const g = new Group()
    lights.forEach(light => g.add(light))
    return g
}

export function getSceneBoundingBox(scene) {

    const selection = getChildrenGeometries(scene.children)
    const box = new Box3()

    selection.forEach((mesh: any) => {
        box.expandByObject(mesh)
    })

    return box
}

export function fitSceneToContentIfNeeded(fromBBox: Box3, scene: Scene, camera: PerspectiveCamera, controls: TrackballControls) {

    if (!scene || !camera || !controls)
        return
    let toBBox = getSceneBoundingBox(scene)
    let size = fromBBox.getSize(new Vector3())
    let fromSize = Math.max(size.x, size.y, size.z)
    size = toBBox.getSize(new Vector3())
    let toSize = Math.max(size.x, size.y, size.z)

    if (fromSize == 0 && toSize > 0) {
        fitSceneToContent(scene, camera, controls)
    }

    let minTranslation = fromBBox.min.distanceTo(toBBox.min) / fromSize
    let maxTranslation = fromBBox.max.distanceTo(toBBox.max) / fromSize
    let hasChanged = minTranslation > 0.1 || maxTranslation > 0.1

    if (hasChanged && controls) {
        fitSceneToContent(scene, camera, controls)
    }
}
