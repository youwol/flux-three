

import {Schemas } from './schemas';
import { Context, expectInstanceOf, expectSingle, ModuleFlux, Pipe } from '@youwol/flux-core';
import { Material, DoubleSide, Geometry, Box3, Object3D, Vector3, Group, AmbientLight, BufferGeometry, Mesh, MeshStandardMaterial } from 'three';


let contract = expectSingle({when:expectInstanceOf({
        typeName: "Material",
        Type: Material,
        attNames:['material']
    })
})

function defaultMaterial() {
    return new MeshStandardMaterial({ color: 0x3399ff })
}


export class BufferGeometryModule<PersistentData extends Schemas.Object3DConfiguration> extends ModuleFlux {
        
    object3d$ : Pipe<any>

    constructor(
        public readonly geometryName: string, 
        public readonly geometryGenerator : (configuration: PersistentData, instance: BufferGeometryModule<PersistentData>) => BufferGeometry, 
        params){ 
        super(params)    
                
        this.object3d$ = this.addOutput({id:'output'})
        let persistentData = this.getPersistentData<PersistentData>()

        if(persistentData['emitInitialValue']){
            let context = new Context(
                'Initial geometry creation',
                {},
                this.logChannels 
            )
            this.addJournal({
                title: `Initial value from static configuration`,
                abstract: `Geometry created at construction, emitInitialValue is set to true - default material used`,
                entryPoint: context
            })
            this.emitObject(defaultMaterial(), persistentData, context)
        }

        this.addInput({
            id:'input',
            description: `Add 3D objects from incoming messages to the scene. If an object with same
            id is already in the scene it is replaced by the incoming one.`,
            contract: contract,
            onTriggered: ({data, configuration, context} : {data: Material, configuration: PersistentData, context: Context}) => {
                this.emitObject(data, configuration, context)
            }
        })
    }

    emitObject( material: Material, conf:PersistentData, context: Context ){
        
        if( Array.isArray(material))
            material = material.find( d => d instanceof MeshStandardMaterial)

        if( material == undefined || !( material instanceof MeshStandardMaterial) )
        {
            material = new MeshStandardMaterial({ color: 0x3399ff });
            material.side = DoubleSide;
            context.info("No material provided, use default", material)
        }
        
        let geometry = this.geometryGenerator( conf, this )     

        applyTransformation(geometry, conf.transform)

        context.info("Geometry created", geometry)
        
        let object3d = createFluxThreeObject3D( {
            object: new Mesh(geometry, material),
            id: conf.objectId,
            displayName: conf.objectName
        })
        this.object3d$.next({data:object3d, configuration:{}, context})
        context.terminate()
    }
}


export function createFluxThreeObject3D( {object, id, displayName } :{object: Object3D, id: string, displayName: string}){

    object.name = id
    object.userData.displayName = displayName
    return object
}


export function applyTransformation(geometry : Geometry | BufferGeometry, transform:Schemas.GlobalTransform){

    let scale       = transform.scaling
    let rotation    = transform.rotation
    let translation = transform.translation

    geometry.scale(scale.x,scale.y,scale.z)
    geometry.rotateX(rotation.x/180 *Math.PI)
    geometry.rotateY(rotation.y/180 *Math.PI)
    geometry.rotateZ(rotation.z/180 *Math.PI)
    geometry.translate(translation.x,translation.y,translation.z)
}


export function fitSceneToContent(scene: any, camera: any, controls :any) {
    
    const selection = scene.children
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
