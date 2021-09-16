
import { BuilderView, Flux, Property, Schema} from '@youwol/flux-core'
import { BoxBufferGeometry } from 'three'
import { BufferGeometryModule } from './buffer-geometry.module'

import{pack} from './main'
import { Schemas } from './schemas'

/**
 * ## Presentation
 * 
 * Creates a [box geometry](https://threejs.org/docs/#api/en/geometries/BoxGeometry) using
 * a default or provided material.
 *   
 *  ## Resources
 *
 * Various resources:
 * -    [three.js](https://threejs.org/): the three. js library, on top of which is built this module 
 * -    [three box](https://threejs.org/docs/#api/en/geometries/BoxGeometry): the box geometry representation for three.js
  */
export namespace ModuleBox {
    
   //Icons made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    let svgIcon = `<g xmlns="http://www.w3.org/2000/svg">
    <path d="M483.674,101.836c-0.064-0.232-0.168-0.44-0.256-0.656c-0.176-0.456-0.368-0.896-0.624-1.312    c-0.144-0.232-0.296-0.44-0.464-0.656c-0.272-0.368-0.576-0.704-0.92-1.016c-0.2-0.192-0.4-0.368-0.624-0.536    c-0.128-0.096-0.224-0.216-0.352-0.304c-0.296-0.2-0.624-0.312-0.936-0.472c-0.16-0.08-0.28-0.2-0.448-0.272l-232-96    c-1.968-0.816-4.16-0.816-6.128,0l-232,96c-0.168,0.072-0.296,0.192-0.456,0.272c-0.312,0.152-0.632,0.272-0.92,0.464    c-0.128,0.088-0.224,0.208-0.352,0.304c-0.224,0.168-0.416,0.352-0.616,0.536c-0.336,0.312-0.64,0.648-0.92,1.016    c-0.168,0.216-0.32,0.424-0.464,0.656c-0.256,0.416-0.448,0.856-0.624,1.312c-0.088,0.224-0.192,0.424-0.256,0.656    c-0.184,0.704-0.312,1.432-0.312,2.176v280c0,3.24,1.952,6.16,4.936,7.392l232,96c0.104,0.04,0.216,0.024,0.32,0.064    c0.888,0.328,1.8,0.544,2.744,0.544c0.944,0,1.856-0.216,2.744-0.544c0.104-0.04,0.216-0.024,0.32-0.064l232-96    c2.984-1.232,4.936-4.152,4.936-7.392v-280C484.002,103.26,483.874,102.532,483.674,101.836z M236.002,468.028l-216-89.368    V115.972l216,89.376V468.028z M244.002,191.348l-211.08-87.344l211.08-87.344l211.08,87.344L244.002,191.348z M468.002,378.66    l-216,89.376V205.348l216-89.376V378.66z"/>
    </g>`

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
         * Width; that is, the length of the edges parallel to the X axis. Default is 1.
         */
        @Property({ 
            description: "Width; that is, the length of the edges parallel to the X axis. Default is 1.",
            min:0
        })
        readonly width : number

        /**
         * Height; that is, the length of the edges parallel to the Y axis. Default is 1.
         */ 
        @Property({ 
            description: "Height; that is, the length of the edges parallel to the Y axis. Default is 1.",
            min:0
        })
        readonly height : number

        /**
         * Depth; that is, the length of the edges parallel to the Z axis. Default is 1.
         */
        @Property({ 
            description: "Depth; that is, the length of the edges parallel to the Z axis. Default is 1.",
            min:0
        })
        readonly depth : number

        /**
         * Number of segmented rectangular faces along the width of the sides. Default is 10.
         */
        @Property({ 
            description: "Number of segmented rectangular faces along the width of the sides. Default is 10.",
            min:0
        })
        readonly widthCount : number

        /**
         * Number of segmented rectangular faces along the height of the sides. Default is 10.
         */
        @Property({ 
            description: "Number of segmented rectangular faces along the height of the sides. Default is 10.",
            min:0
        })
        readonly heightCount : number

        /**
         * Number of segmented rectangular faces along the depth of the sides. Defaults to 10.
         */
        @Property({ 
            description: "Number of segmented rectangular faces along the depth of the sides. Defaults to 10.",
            min:0
        })
        readonly depthCount : number


        constructor({width,height,depth,widthCount,heightCount,depthCount, ... others} :
            {radius?,width?,height?,depth?,widthCount?,heightCount?,depthCount?, others?:[any]}= {}
            ) {

            super( {...{ objectId : "boxGeometry" }, ...others} )

            this.width        = width != undefined ? width : 1
            this.height       = height != undefined ? height : 1
            this.depth        = depth != undefined ? depth : 1
            this.widthCount   = widthCount != undefined ? widthCount : 10
            this.heightCount  = heightCount != undefined ? heightCount : 10
            this.depthCount   = depthCount != undefined ? depthCount : 10
        }
    }

    /** ## Module
    * 
    * General documentation of this module provided [[ModuleBox | here]].
    * 
    */
    @Flux({
        pack:           pack,
        namespace:      ModuleBox,
        id:             "ModuleBox",
        displayName:    "Box",
        description:    "Box geometry",
        resources: {
            'technical doc': `${pack.urlCDN}/dist/docs/modules/lib_box_module.modulebox.html`
        }
    })
    @BuilderView({
        namespace:      ModuleBox,
        icon:           svgIcon
    })
    export class Module extends BufferGeometryModule<PersistentData> {

        static shape(config : PersistentData){
            return new BoxBufferGeometry( config.width, config.height,config.depth, config.widthCount, config.heightCount,config.depthCount )
        }

        constructor(params){ 
            super("box", Module.shape, params)   
        }
    }
}
