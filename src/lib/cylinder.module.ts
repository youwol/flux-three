
import { BuilderView, Flux, Property, Schema} from '@youwol/flux-core'
import { CylinderBufferGeometry } from 'three'
import { BufferGeometryModule } from './buffer-geometry.module'
    
import{pack} from './main'
import { Schemas } from './schemas'

/**
 * ## Presentation
 * 
 * Creates a [cylinder geometry](https://threejs.org/docs/#api/en/geometries/CylinderGeometry) using
 * a default or provided material.
 *   
 *  ## Resources
 *
 * Various resources:
 * -    [three.js](https://threejs.org/): the three. js library, on top of which is built this module 
 * -    [three cylinder](https://threejs.org/docs/#api/en/geometries/CylinderGeometry): the cylinder geometry representation for three.js
  */
export namespace ModuleCylinder {
    
    let svgIcon = `<g xmlns="http://www.w3.org/2000/svg" id="Cylinder-2" data-name="Cylinder"><ellipse cx="256" cy="440" rx="128" ry="56" style="fill:#57a4ff"/><path d="M384,72V440c0-30.93-57.31-56-128-56s-128,25.07-128,56V72c0,30.93,57.31,56,128,56S384,102.93,384,72Z" style="fill:#57a4ff"/><path d="M349.716,25.073C324.552,14.063,291.27,8,256,8s-68.552,6.063-93.716,17.073C135.017,37,120,53.668,120,72V440c0,18.332,15.017,35,42.284,46.927C187.448,497.937,220.73,504,256,504s68.552-6.063,93.716-17.073C376.983,475,392,458.332,392,440V72C392,53.668,376.983,37,349.716,25.073ZM256,192a8,8,0,0,0-8,8V376.116c-32.277.846-62.464,6.784-85.716,16.957-10.711,4.686-19.521,10.105-26.284,16.066V102.861c6.763,5.961,15.573,11.38,26.284,16.066C187.448,129.937,220.73,136,256,136s68.552-6.063,93.716-17.073c10.711-4.686,19.521-10.105,26.284-16.066V409.139c-6.763-5.961-15.573-11.38-26.284-16.066C326.464,382.9,296.277,376.962,264,376.116V200A8,8,0,0,0,256,192ZM168.7,39.731C191.885,29.587,222.889,24,256,24s64.115,5.587,87.3,15.731C364.082,48.822,376,60.584,376,72s-11.918,23.178-32.7,32.269C320.115,114.413,289.111,120,256,120s-64.115-5.587-87.3-15.731C147.918,95.178,136,83.416,136,72S147.918,48.822,168.7,39.731ZM343.3,472.269C320.115,482.413,289.111,488,256,488s-64.115-5.587-87.3-15.731C147.918,463.178,136,451.416,136,440s11.918-23.178,32.7-32.269c21.308-9.322,49.224-14.782,79.3-15.608V408a8,8,0,0,0,16,0V392.123c30.079.826,58,6.286,79.3,15.608C364.082,416.822,376,428.584,376,440S364.082,463.178,343.3,472.269Z" style="fill:#004fac"/><path d="M256,424a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,256,424Z" style="fill:#004fac"/></g>`

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
         * Radius of the cylinder at the top. Default is 1.
         */
        @Property({ 
            description: "Radius of the cylinder at the top. Default is 1.",
            min: 0
        })
        readonly radiusTop : number

        /**
         * Radius of the cylinder at the bottom. Default is 1.
         */
        @Property({ 
            description: "Radius of the cylinder at the bottom. Default is 1.",
            min: 0
        })
        readonly radiusBottom : number

        /**
         * Height of the cylinder. Default is 1.
         */
        @Property({ 
            description: "Height of the cylinder. Default is 1.",
            min: 0
        })
        readonly height : number

        /**
         * Number of segmented faces around the circumference of the cylinder. Default is 8
         */
        @Property({ 
            description: "Number of segmented faces around the circumference of the cylinder. Default is 8",
            min: 0
        })
        readonly radialCount : number

        /**
         *  Number of rows of faces along the height of the cylinder. Default is 1.
         */
        @Property({ 
            description: " Number of rows of faces along the height of the cylinder. Default is 1.",
            min: 0
        })
        readonly heightCount : number

        constructor( {radiusTop,radiusBottom, height, radialCount,heightCount, ...others}:
                     {radiusTop?: number,radiusBottom?: number, height?: number, radialCount?: number,heightCount?: number, others?:[any]}
                      = {} ) {
            super( {...{objectId:"cylinderGeometry"}, ...others} )
            this.radiusTop      = radiusTop != undefined ? radiusTop : 1
            this.radiusBottom   = radiusBottom != undefined ? radiusBottom : 1
            this.height         = height  != undefined ? height : 1
            this.radialCount    = radialCount  != undefined ? radialCount : 8
            this.heightCount    = heightCount != undefined ? heightCount : 1
        }
    }

    /** ## Module
    * 
    * General documentation of this module provided [[ModuleCylinder | here]].
    * 
    */
    @Flux({
        pack:           pack,
        namespace:      ModuleCylinder,
        id:             "ModuleCylinder",
        displayName:    "Cylinder",
        description:    "Cylinder geometry",
        resources: {
            'technical doc': `${pack.urlCDN}/dist/docs/modules/lib_cylinder_module.modulecylinder.html`
        }
    })
    @BuilderView({
        namespace:      ModuleCylinder,
        icon:           svgIcon
    })
    export class Module extends BufferGeometryModule<PersistentData> {

        static shape(config : PersistentData){
            return new CylinderBufferGeometry( config.radiusTop, config.radiusBottom, config.height,config.radialCount, config.heightCount )
        }

        constructor(params){ 
            super("cylinder", Module.shape, params)   
        }
    }
}
