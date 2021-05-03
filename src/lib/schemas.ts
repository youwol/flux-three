import { Property, Schema } from "@youwol/flux-core"
import { pack } from "./main"

export namespace Schemas {

    @Schema({
      pack: pack
    })
    export class Transform3d {
  
      /**
       * Transformation related to the X-axis
       */
      @Property({ description: "Transformation related to the X-axis" })
      readonly x: number
  
      /**
       * Transformation related to the Y-axis
       */
      @Property({ description: "Transformation related to the Y-axis" })
      readonly y: number
  
      /**
       * Transformation related to the Z-axis
       */
      @Property({ description: "Transformation related to the Z-axis" })
      readonly z: number
  
      constructor( {x, y, z} : { x?:number, y?:number, z?:number} = {} ) {
        this.x = x != undefined ? x : 0
        this.y = y != undefined ? y : 0
        this.z = z != undefined ? z : 0
      }
    }
  
  
    @Schema({
      pack: pack
    })
    export class Translation extends Transform3d {
    }  
  

    @Schema({
      pack: pack
    })
    export class Rotation extends Transform3d {      
    }
  
  
    @Schema({
      pack: pack
    })
    export class Scaling extends Transform3d {
  
      constructor( {x, y, z} : {x?: number, y?: number, z?: number} ={}) {
        super( { x : x!=undefined? x : 1, 
                 y : y!=undefined? y : 1,
                 z : z!=undefined? z : 1})
      }
    }
  
  
    @Schema({
      pack: pack
    })
    export class GlobalTransform {  

      /**
       * Translation part of the global transformation
       */
      @Property({ description: "Translation" })
      readonly translation: Translation
  
      /**
       * Rotation part of the global transformation
       */
      @Property({ description: "Rotation" })
      readonly rotation: Rotation
  
       /**
       * Scaling part of the global transformation
       */
      @Property({ description: "Scaling" })
      readonly scaling: Scaling
  
      constructor( {translation, rotation, scaling} :{translation?:Object, rotation?:Object, scaling?:Object} = {}) {
        this.rotation = rotation != undefined ? new Rotation(rotation) :new Rotation()
        this.translation =  translation != undefined ? new Translation(translation) :new Translation()
        this.scaling =  scaling != undefined ? new Scaling(scaling) :new Scaling()
      }
    }
  
    
    @Schema({
      pack: pack
    })
    export class Object3DConfiguration {
  
      /**
       * id of the object. 
       * 
       * When the object is included in a scene, only one object with specific id is allowed:
       * if one is already in the scene it is replaced.
       */
      @Property({ description: "id of the object" })
      readonly objectId: string
  
      /**
       * Display name of the object
       */
      @Property({ description: "name of the object" })
      readonly objectName: string
    
      /**
       * Global transformation applied on the object (translation, rotation & scaling)
       */
      @Property({ description: "transformation" })
      readonly transform: GlobalTransform
  
  
      constructor( { objectId, objectName, transform} :{ objectId?:string, objectName?:string, transform?: Object }
      ) {
        this.objectId = objectId != undefined ? objectId : 'Object3D'
        this.objectName = objectName != undefined ? objectName : this.objectId
        this.transform = transform != undefined ? new GlobalTransform(transform) : new GlobalTransform() 
      }
    }
  
    @Schema({
      pack: pack
    })
    export class SimpleObject3DConfiguration extends Object3DConfiguration {
  
      /**
       * If true, the configuration saved is used to emit the object as soon as 
       * the module is created.
       * 
       * If false, the object creation will only be triggered when an incoming messages
       * reach the module.
       */
      @Property({ description: "emit initial value or not" })
      readonly emitInitialValue : boolean
  
      constructor( {emitInitialValue, ...others} :
                   {emitInitialValue?:boolean, others?:any}
                   = {})
       {
          super(others as any)
          this.emitInitialValue = emitInitialValue != undefined ? emitInitialValue : true
      }
    }
  
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
  
    @Schema({
      pack: pack
    })
    export class MaterialConfiguration {
  
      @Property({ description: "active/disable transparency" })
      readonly transparent: boolean
  
      @Property({ description: "opacity if transparent property is true" })
      readonly opacity: number
  
      @Property({ description: "opacity if transparent property is true" })
      readonly depthTest: boolean
  
      @Property({ description: "opacity if transparent property is true" })
      readonly depthWrite: boolean
  
      @Property({ description: "opacity if transparent property is true" })
      readonly visible: boolean
  
      @Property({
        description: "front, back or both sides",
        enum: ["FrontSide", "BackSide", "DoubleSide"]
      })
      readonly side: string
  
      constructor({ transparent, opacity, depthTest, depthWrite, visible }: any = {}
      ) {
        this.transparent = (transparent != undefined) ? transparent : false
        this.opacity = (opacity != undefined) ? opacity : 1
        this.depthTest = (depthTest != undefined) ? depthTest : true
        this.depthWrite = (depthWrite != undefined) ? depthWrite : true
        this.visible = (visible != undefined) ? visible : true
      }
    }
  
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
  
    @Schema({
      pack: pack
    })
    export class StandardMaterialConfiguration extends MaterialConfiguration {
  
      @Property({ description: "color" })
      readonly color: string
  
      @Property({ description: "emissive color" })
      readonly emissive: string
  
      @Property({ description: "rougness" })
      readonly roughness: number
  
      @Property({ description: "metalness" })
      readonly metalness: number
  
      @Property({ description: "flatShading" })
      readonly flatShading: boolean
  
      @Property({ description: "wireframe" })
      readonly wireframe: boolean
  
      @Property({ description: "wireframe line width" })
      readonly wireframeLinewidth: number
  
      constructor({ color, emissive, roughness, metalness, flatShading, wireframe, wireframeLinewidth, vertexColors, ...others }: any = {}) {
        super(others)
        this.color = (color != undefined) ? color : "0x3399ff"
        this.emissive = (emissive != undefined) ? emissive : "0x0"
        this.roughness = (roughness != undefined) ? roughness : 0.5
        this.metalness = (metalness != undefined) ? metalness : 0.5
        this.flatShading = (flatShading != undefined) ? flatShading : false
        this.wireframe = (wireframe != undefined) ? wireframe : false
        this.wireframeLinewidth = (wireframeLinewidth != undefined) ? wireframeLinewidth : 1
      }
    }
  }