import {Property, Flux,BuilderView, PluginFlux , SideEffects, Schema } from "@youwol/flux-core"
import {Object3D,Group,PointLight,Vector3,Box3} from 'three'
import { pack } from "./main";
import { ModuleViewer } from './viewer.module';


function createDefaultLights(
    {scaling, object, intensity=0.5}:
    {scaling?: number, object?: Object3D, intensity?: number}): Group
{
    const g = new Group()
    const lights = []
    const color = 0xaaaaaa
    //const intensity = 0.5

    for (let i=0; i<8; ++i) {
        lights[ i ] = new PointLight( color, intensity, 0 )
        g.add( lights[ i ] )
    }

    let c = new Vector3()
    let scale = scaling!==undefined?scaling:1
    let distance = 100

    if (object) {
        const box = new Box3().setFromObject(object)
        c = box.getCenter(new Vector3())
        const size   = box.getSize(new Vector3())
        distance = Math.max(size.x, size.y, size.z)*scale
    }

    let i = 0
    lights[ i++ ].position.set( c.x-distance, c.y-distance, c.z-distance )
    lights[ i++ ].position.set( c.x+distance, c.y-distance, c.z-distance )
    lights[ i++ ].position.set( c.x+distance, c.y+distance, c.z-distance )
    lights[ i++ ].position.set( c.x+distance, c.y+distance, c.z+distance )
    lights[ i++ ].position.set( c.x-distance, c.y+distance, c.z-distance )
    lights[ i++ ].position.set( c.x-distance, c.y+distance, c.z+distance )
    lights[ i++ ].position.set( c.x-distance, c.y-distance, c.z+distance )
    lights[ i++ ].position.set( c.x+distance, c.y-distance, c.z+distance )

    return g
}


let icon = `
<g><path d="m361.344 326.149-41.246 87.736-64.094 92.614-65.947-95.786-39.393-84.564 44.136-67.276 61.204-44.174 64.84 48.02z" fill="#fff04a"/>
<path d="m256.004 214.699-.211.152v291.341l.211.307 64.094-92.614 41.246-87.736-40.5-63.43z" fill="#ffda45"/>
<g><path d="m507.904 481.189-146.56-155.04-105.34 180.35h241c5.99 0 11.41-3.57 13.78-9.07s1.24-11.88-2.88-16.24zm-389.21-411.75c-5.02-5.31-88.07 50.93-84.23 57.77l116.2 198.94 105.34-111.45z" fill="#fffd78"/></g>
<path d="m393.314 69.439-137.31 145.26 105.34 111.45 116.2-198.94c3.84-6.84-79.21-63.08-84.23-57.77z" fill="#fff04a"/>
<path d="m4.104 481.189c-4.12 4.36-5.25 10.74-2.88 16.24s7.79 9.07 13.78 9.07h241l-105.34-180.35z" fill="#fffd78"/><g>
<path d="m361.344 326.149-105.34 180.35h241c5.99 0 11.41-3.57 13.78-9.07s1.24-11.88-2.88-16.24z" fill="#fff04a"/></g>
<g><path d="m47.546 134.872c-1.151 0-2.307-.132-3.446-.401-4.044-.955-7.511-3.544-9.574-7.15l-28.748-50.255c-.099-.172-.193-.347-.285-.522-11.668-22.415-3.976-50.392 17.51-63.692 21.468-13.29 49.121-8.107 64.318 12.057.089.118.176.237.261.357l32.453 45.809c2.344 3.308 3.248 7.422 2.509 11.408s-3.06 7.501-6.434 9.749l-60.25 40.125c-2.484 1.654-5.38 2.515-8.314 2.515z" fill="#414952"/></g>
<g><path d="m36.977 141.921c-4.85 0-9.608-2.348-12.498-6.687-4.593-6.895-2.726-16.207 4.17-20.799l81.416-54.221c6.894-4.593 16.207-2.726 20.799 4.17 4.593 6.895 2.726 16.207-4.17 20.799l-81.416 54.221c-2.556 1.703-5.445 2.517-8.301 2.517z" fill="#636978"/></g>
<g><path d="m464.462 134.872c-2.934 0-5.83-.861-8.314-2.515l-60.25-40.125c-3.374-2.247-5.694-5.763-6.434-9.749s.165-8.1 2.509-11.408l32.453-45.809c.085-.12.172-.239.261-.357 15.198-20.164 42.848-25.347 64.319-12.057 21.485 13.3 29.177 41.277 17.51 63.691-.092.176-.187.35-.285.522l-28.748 50.254c-2.063 3.606-5.53 6.196-9.574 7.15-1.139.27-2.295.403-3.447.403z" fill="#23272b"/></g>
<g><path d="m475.032 141.921c-2.857 0-5.745-.814-8.301-2.517l-81.416-54.221c-6.896-4.592-8.763-13.904-4.17-20.799s13.906-8.761 20.799-4.17l81.416 54.221c6.896 4.592 8.763 13.904 4.17 20.799-2.89 4.339-7.649 6.687-12.498 6.687z" fill="#555a66"/></g>
</g>
`
/**
 * ## Presentation
 * 
 * Add some lights in a scene rendered by a [[ModuleViewer]].
 *   
 *  ## Resources
 *
 * Various resources:
 * -    [three.js](https://threejs.org/): the three. js library, on top of which is built this module 
 * -    [three lights](https://threejs.org/docs/#api/en/lights/Light): 
 * the light representation for three.js
  */
export namespace PluginSpotlights {
    
    @Schema({
        pack: pack,
    })
    export class PersistentData  {

        /**
         * Intensity of the lights, default to 0.5
         */
        @Property({ description: "spots intensity", type: "float", min:0, max:1 })
        readonly spotsIntensity: number

        constructor( { spotsIntensity } :
                     { spotsIntensity?: number } =
                     {} ) {
            
            this.spotsIntensity = (spotsIntensity!=undefined) ? spotsIntensity : 0.5
        }        
    }

    @Flux({
        pack:           pack,
        namespace:      PluginSpotlights,
        id:             "Spotlights",
        displayName:    "Spotlights",
        description:    "Spot lights around scene",
        compatibility: {
            "the parent module needs to be an instance of flux-three Viewer module":
                (mdle: unknown) => mdle instanceof ModuleViewer.Module,
        },
        resources: {
            'technical doc': `${pack.urlCDN}/dist/docs/modules/lib_spotlights_module.pluginspotlights.html`
        }
    })
    @BuilderView({
        namespace:      PluginSpotlights,
        icon:           icon 
    })
    export class Module extends PluginFlux<ModuleViewer.Module>  implements SideEffects{

        scene           = undefined
        subscription    = undefined

        constructor(params){ 
            super(params)
        }

        apply(){
            let defaultConf = this.getPersistentData<PersistentData>()
            this.subscription = this.parentModule.pluginsGateway.scene$.subscribe( scene => {
                
                let lights = scene.getObjectByName( "lights_"+this.moduleId);
                scene.remove(lights)
                let lightsGroup   = createDefaultLights({object:scene,intensity: defaultConf.spotsIntensity })
                lightsGroup.name  = "lights_"+this.moduleId
                scene.add( lightsGroup)
                this.scene = scene
            })
        }

        dispose() {
            if(!this.subscription)
                return 

            this.subscription.unsubscribe()           
            let lights = this.scene.getObjectByName( "lights_"+this.moduleId);
            this.scene.remove(lights)
            this.subscription = undefined
        }
    }
}

