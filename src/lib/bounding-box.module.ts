
import { BuilderView, expectInstanceOf, expectSome, Flux, ModuleFlux, Pipe, Property, Schema} from '@youwol/flux-core'
import { Context } from 'node:vm'
import { Box3, BoxBufferGeometry, Group, Object3D } from 'three'
import { BufferGeometryModule } from './buffer-geometry.module'

import{pack} from './main'
import { Schemas } from './schemas'

/**
 * ## Presentation
 * 
 * Compute the bounding box of objects.
 *   
 *  ## Resources
 *
 * Various resources:
 * -    [three.js](https://threejs.org/): the three. js library, on top of which is built this module 
 * -    [bounding box](https://threejs.org/docs/#api/en/math/Box3): the bounding box representation for three.js
  */
export namespace ModuleBoundingBox {
    
   //<div>Icons made by <a href="https://www.flaticon.com/authors/prettycons" title="prettycons">prettycons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
   let svgIcon = `
   <path d="m56.03 8c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.795 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"/>
   <path d="m47.03 17c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.795 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"/>
   <path d="m4.03 8c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.795 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"/>
   <path d="m13.03 17c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.795 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"/>
   <path d="m56.03 60c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.795 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"/>
   <path d="m47.03 51c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.795 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"/>
   <path d="m4.03 60c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.795 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"/>
   <path d="m13.03 51c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.795 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"/>
   <path d="m53.03 57h-46c-.552 0-1-.448-1-1 0-1.103-.897-2-2-2-.552 0-1-.448-1-1v-46c0-.552.448-1 1-1 1.103 0 2-.897 2-2 0-.552.448-1 1-1h46c.552 0 1 .448 1 1 0 1.103.897 2 2 2 .552 0 1 .448 1 1v46c0 .552-.448 1-1 1-1.103 0-2 .897-2 2 0 .552-.448 1-1 1zm-45.127-2h44.253c.363-1.404 1.47-2.511 2.874-2.874v-44.253c-1.404-.363-2.511-1.47-2.874-2.874h-44.253c-.363 1.404-1.47 2.511-2.874 2.874v44.253c1.405.363 2.512 1.47 2.874 2.874zm39.127-4c-1.86 0-3.428-1.277-3.874-3h-26.253c-.445 1.723-2.013 3-3.874 3-2.206 0-4-1.794-4-4 0-1.86 1.277-3.428 3-3.874v-26.253c-1.723-.445-3-2.013-3-3.874 0-2.206 1.794-4 4-4 1.86 0 3.428 1.277 3.874 3h26.253c.445-1.723 2.013-3 3.874-3 2.206 0 4 1.794 4 4 0 1.86-1.277 3.428-3 3.874v26.253c1.723.445 3 2.013 3 3.874 0 2.206-1.795 4-4 4zm-31-5h28c.552 0 1 .448 1 1 0 1.103.897 2 2 2s2-.897 2-2-.897-2-2-2c-.552 0-1-.448-1-1v-28c0-.552.448-1 1-1 1.103 0 2-.897 2-2s-.897-2-2-2-2 .897-2 2c0 .552-.448 1-1 1h-28c-.552 0-1-.448-1-1 0-1.103-.897-2-2-2s-2 .897-2 2 .897 2 2 2c.552 0 1 .448 1 1v28c0 .552-.448 1-1 1-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2c0-.552.448-1 1-1z"/>
   `

        /**
     * ## Persistent Data  🔧
     *
     * Exposed properties are the attributes of this class.
     */
    @Schema({
        pack: pack,
    })
    export class PersistentData extends Schemas.SimpleObject3DConfiguration{

        constructor() {
            super()
        }
    }
    
    let inputExpectation = expectSome({
        //description:'Object3D',
        when:expectInstanceOf({
            typeName:'Object3D',
            Type: Object3D,
            attNames:['object']
        })
    })
    /** ## Module
    * 
    * General documentation of this module provided [[ModuleBox | here]].
    * 
    */
    @Flux({
        pack:           pack,
        namespace:      ModuleBoundingBox,
        id:             "ModuleBoundingBox",
        displayName:    "Bounding Box",
        description:    "Bounding Box",
        resources: {
            'technical doc': `${pack.urlCDN}/dist/docs/modules/lib_bounding_box_module.moduleboundingbox.html`
        }
    })
    @BuilderView({
        namespace:      ModuleBoundingBox,
        icon:           svgIcon
    })
    export class Module extends ModuleFlux {

        output$ : Pipe<Box3>

        constructor(params){ 
            super(params)   

            this.addInput({
                id:'input',
                description:'compute the bounding box of incoming objects',
                contract: inputExpectation,
                onTriggered: ({data, configuration, context}) => this.computeBoundingBox(data, context)
            })
            this.output$ = this.addOutput()
        }

        computeBoundingBox(objects: Array<Object3D>, context: Context){

            let group = new Group()
            objects.forEach( object => group.add(object))
            let bbox = new Box3().setFromObject(group)
            this.output$.next({data:bbox, context})
        }
    }
}
