
import { BuilderView, Context, expectInstanceOf, expectSome, Flux, ModuleFlux, Pipe, PluginFlux, Property, Schema, SideEffects} from '@youwol/flux-core'
import { combineLatest, merge, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { Object3D, Raycaster, Vector2 } from 'three'

import{pack} from './main'
import { ModuleViewer } from './viewer.module'

/**
 * ## Presentation
 * 
 * The Ray Caster plugin compute intersection of the objects behind the mouse in a 3D viewer.
 * 
 *  ## Resources
 *
 * Various resources:
 * -    [three.js](https://threejs.org/): the three. js library, on top of which is built this module 
 * -    [ray caster](https://threejs.org/docs/#api/en/core/Raycaster): the ray caster representation for three.js
 * 
  */
export namespace ModuleRayCaster {
    
   //Icons made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    let svgIcon = `<circle style="fill:#84DBFF;" cx="252.5" cy="252.5" r="252.5"/>
    <g>
        <path style="fill:#324A5E;" d="M252.5,422.4c-93.7,0-169.9-76.2-169.9-169.9S158.8,82.6,252.5,82.6s169.9,76.2,169.9,169.9   S346.2,422.4,252.5,422.4z M252.5,106.1c-80.7,0-146.4,65.7-146.4,146.4s65.7,146.4,146.4,146.4s146.4-65.7,146.4-146.4   S333.2,106.1,252.5,106.1z"/>
        <path style="fill:#324A5E;" d="M252.5,348.2c-52.8,0-95.7-42.9-95.7-95.7s42.9-95.7,95.7-95.7s95.7,42.9,95.7,95.7   S305.3,348.2,252.5,348.2z M252.5,180.3c-39.8,0-72.2,32.4-72.2,72.2s32.4,72.2,72.2,72.2s72.2-32.4,72.2-72.2   S292.3,180.3,252.5,180.3z"/>
    </g>
    <g>
        <rect x="240.8" y="49.6" style="fill:#FF7058;" width="23.4" height="163.4"/>
        <rect x="240.8" y="292" style="fill:#FF7058;" width="23.4" height="163.4"/>
        <rect x="292" y="240.8" style="fill:#FF7058;" width="163.4" height="23.4"/>
        <rect x="49.6" y="240.8" style="fill:#FF7058;" width="163.4" height="23.4"/>
    </g>`

    /**
     * ## Persistent Data  🔧
     *
     */
    @Schema({
        pack: pack,
    })
    export class PersistentData{

        constructor() {
        }
    }

    let contract = expectSome({
        when: expectInstanceOf({
            typeName: 'Object3D',
            Type:Object3D,
            attNames: ["object", "mesh"]
        })
    })

    /** ## Module
    * 
    * General documentation of this module provided [[ModuleRayCaster | here]].
    * 
    */
    @Flux({
        pack:           pack,
        namespace:      ModuleRayCaster,
        id:             "ModuleRayCaster",
        displayName:    "Ray caster",
        description:    "Ray caster",
        resources: {
            'technical doc': `${pack.urlCDN}/docs/modules/lib_ray_caster_plugin.moduleraycaster.html`
        },
        compatibility: {
            "Parent module needs to be a flux-pack-3d-basics Viewer": (mdle) => mdle instanceof ModuleViewer.Module
            }
    })
    @BuilderView({
        namespace:      ModuleRayCaster,
        icon:           svgIcon
    })
    export class Module extends PluginFlux<ModuleViewer.Module> implements SideEffects{

        output$ : Pipe<{intersections:THREE.Intersection[], event: MouseEvent}>

        objectsStore : {[key:string]: Object3D} = {}
        contexts : {[key:string]: any} = {}

        viewer: ModuleViewer.Module
        
        constructor(params){ 
            super(params)   
            
            this.viewer = this.parentModule

            this.addInput({
                id:"object", 
                description:"object input",
                contract: contract,
                onTriggered: ({data,configuration, context}) =>  this.registerObject(data, context)
            })
            this.output$ = this.addOutput()
        }

        mouseSubscription : Subscription 
        
        apply(){
            this.mouseSubscription = combineLatest([
                merge(this.parentModule.pluginsGateway.mouseDown$,
                      this.parentModule.pluginsGateway.mouseMove$),
                this.parentModule.pluginsGateway.renderingDiv$]
                )
            .pipe(
                map( ([event, div]: [MouseEvent, HTMLDivElement]) => {
                    let mouse       = new Vector2();
                    mouse.x         = ( event['layerX'] / div.querySelector("canvas").clientWidth ) * 2 - 1;
                    mouse.y         = - (event['layerY'] / div.querySelector("canvas").clientHeight ) * 2 + 1;
                    return {mouse, event}
                }),
                map( ({mouse, event}) => {
                    let raycaster   = new Raycaster();        
                    raycaster.setFromCamera( mouse,  this.parentModule.camera );
                    let meshes = Object.values(this.objectsStore)
                    return {intersections:raycaster.intersectObjects( meshes, true ), event};
                })
            ).subscribe(({intersections, event}) => {
                if(intersections.length==0)
                    return 
                let userContext = intersections.reduce( (acc,e) => ({...acc, ...this.contexts[e.object.name]}), {})
                this.output$.next({data: {intersections, event}, context: new Context("", userContext)})
            })
        }

        dispose(){
            this.mouseSubscription.unsubscribe()
        }

        registerObject(objects: Object3D[], context: Context){
            objects.forEach( object =>{
                this.objectsStore[object.name] = object
                this.contexts[object.name] = context.userContext
            })
            this.viewer.render(objects, new Context("",{}))
        }
    }
}
