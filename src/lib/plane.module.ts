
import { BuilderView, Flux, Property, Schema} from '@youwol/flux-core'
import { PlaneBufferGeometry } from 'three'
import { BufferGeometryModule } from './buffer-geometry.module'

import{pack} from './main'
import { Schemas } from './schemas'

/**
 * ## Presentation
 * 
 * Creates a [plane geometry](https://threejs.org/docs/#api/en/geometries/PlaneGeometry) using
 * a default or provided material.
 *   
 *  ## Resources
 *
 * Various resources:
 * -    [three.js](https://threejs.org/): the three. js library, on top of which is built this module 
 * -    [three plane](https://threejs.org/docs/#api/en/geometries/PlaneGeometry): the plane geometry representation for three.js
  */
export namespace ModulePlane {
    
    let svgIcon = '<path xmlns="http://www.w3.org/2000/svg" d="M209.705,0h-67.401H74.901H7.5C3.357,0,0,3.358,0,7.5v67.401v67.402v67.401c0,4.142,3.357,7.5,7.5,7.5h67.401h67.402h67.401  c4.143,0,7.5-3.358,7.5-7.5v-67.401V74.901V7.5C217.205,3.358,213.848,0,209.705,0z M202.205,67.401h-52.401V15h52.401V67.401z   M202.205,134.804h-52.401V82.401h52.401V134.804z M15,82.401h52.401v52.402H15V82.401z M82.401,82.401h52.402v52.402H82.401V82.401  z M134.804,15v52.401H82.401V15H134.804z M67.401,15v52.401H15V15H67.401z M15,149.804h52.401v52.401H15V149.804z M82.401,202.205  v-52.401h52.402v52.401H82.401z M149.804,202.205v-52.401h52.401v52.401H149.804z"/>'


    /**
     * ## Persistent Data  🔧
     *
     * Exposed properties are the attributes of this class.
     */
    @Schema({
        pack: pack,
    })
    export class PersistentData extends Schemas.SimpleObject3DConfiguration{

        /**
         * Width along the X axis. Default is 1.
         */
        @Property({ 
            description: "Width along the X axis. Default is 1.",
        })
        readonly width:  number

        /**
         * Height along the Y axis. Default is 1.
         */
        @Property({ 
            description: "Height along the Y axis. Default is 1.",
        })
        readonly height:  number

        /**
         * Default is 1
         */
        @Property({ 
            description: "Default is 1",
            type:"integer"
        })
        readonly widthCount:  number

        /**
         * Default is 1
         */
        @Property({ 
            description: " Default is 1",
            type:"integer"
        })
        readonly heightCount:  number

        constructor( { width, height, widthCount, heightCount, ...others} :
            { width?:number, height?:number, widthCount?:number, heightCount?:number,others?:any} = {}) {

            super( {...{objectId:"planeGeometry"}, ...others} )

            this.width       = width != undefined ? width : 1
            this.height      = height != undefined ? height : 1
            this.widthCount  = widthCount != undefined ? widthCount : 10
            this.heightCount = heightCount != undefined ? heightCount : 10
        }
    }

    /** ## Module
    * 
    * General documentation of this module provided [[ModulePlane | here]].
    * 
    */
    @Flux({
        pack:           pack,
        namespace:      ModulePlane,
        id:             "ModulePlane",
        displayName:    "Plane",
        description:    "Plane geometry",
        resources: {
            'technical doc': `${pack.urlCDN}/dist/docs/modules/lib_plane_module.moduleplane.html`
        }
    })
    @BuilderView({
        namespace:      ModulePlane,
        icon:           svgIcon
    })
    export class Module extends BufferGeometryModule<PersistentData> {

        static shape(config : PersistentData){
            return new PlaneBufferGeometry( config.width, config.height, config.widthCount, config.heightCount ); 
        }

        constructor(params){ 
            super("box", Module.shape, params)   
        }
    }
}
