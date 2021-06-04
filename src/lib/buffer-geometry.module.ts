

import {Schemas } from './schemas';
import { Context, expectInstanceOf, expectSingle, ModuleFlux, Pipe } from '@youwol/flux-core';
import { Material, DoubleSide, Box3, Object3D, Vector3, Group, AmbientLight, 
    BufferGeometry, Mesh, MeshStandardMaterial } from 'three';
import { getChildrenGeometries } from './utils';


let contract = expectSingle({when:expectInstanceOf({
        typeName: "Material",
        Type: Material,
        attNames:['material']
    })
})

export function defaultMaterial() {
    return new MeshStandardMaterial({ color: 0x3399ff , side:DoubleSide})
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
        
        let geometry = this.geometryGenerator( conf, this )     

        context.info("Geometry created", geometry)
        
        let object3d = createFluxThreeObject3D( {
            object: new Mesh(geometry, material),
            id: conf.objectId,
            displayName: conf.objectName,
            transform: conf.transform
        })
        this.object3d$.next({data:object3d, configuration:{}, context})
        context.terminate()
    }
}


export function createFluxThreeObject3D( { object, id, displayName, transform} :{
        object: Object3D, 
        id: string, 
        displayName: string,
        transform?: Schemas.GlobalTransform}){

    object.name = id
    object.userData.displayName = displayName
    transform && applyTransformation(object, transform)

    return object
}

/*
export function applyTransformation(geometry : BufferGeometry, transform:Schemas.GlobalTransform){

    let scale       = transform.scaling
    let rotation    = transform.rotation
    let translation = transform.translation

    geometry.scale(scale.x,scale.y,scale.z)
    geometry.rotateX(rotation.x/180 *Math.PI)
    geometry.rotateY(rotation.y/180 *Math.PI)
    geometry.rotateZ(rotation.z/180 *Math.PI)
    geometry.translate(translation.x,translation.y,translation.z)
}*/

export function applyTransformation(object : Object3D, transform:Schemas.GlobalTransform){

    let scale       = transform.scaling
    let rotation    = transform.rotation
    let translation = transform.translation

    let applyOnGeom = (geometry : BufferGeometry) => {
        geometry.scale(scale.x,scale.y,scale.z)
        geometry.rotateX(rotation.x/180 *Math.PI)
        geometry.rotateY(rotation.y/180 *Math.PI)
        geometry.rotateZ(rotation.z/180 *Math.PI)
        geometry.translate(translation.x,translation.y,translation.z)
    } 
    if(object instanceof Group){
        let objects = getChildrenGeometries(object.children)
        objects.forEach( obj => {
            applyOnGeom(obj.geometry)
        });
    }
    if(object instanceof Mesh){
        applyOnGeom(object.geometry)
    }

    return object
    /*
    object.scale.set(scale.x,scale.y,scale.z)
    object.rotateX(rotation.x/180 *Math.PI)
    object.rotateY(rotation.y/180 *Math.PI)
    object.rotateZ(rotation.z/180 *Math.PI)
    object.translateX(translation.x)
    object.translateY(translation.y)
    object.translateZ(translation.z)*/
}
