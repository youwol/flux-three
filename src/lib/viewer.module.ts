import { Scene as FluxScene, BuilderView, Flux, Property, RenderView, Schema, ModuleFlux, 
    expectSome, expectInstanceOf, Context, createEmptyScene } from '@youwol/flux-core'
    
import { ReplaySubject, Subject } from 'rxjs'
import { Color, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import * as TrackballControls from 'three-trackballcontrols'
import { render, VirtualDOM} from '@youwol/flux-view'

import{pack} from './main'
import { createDefaultLights, fitSceneToContentIfNeeded, getSceneBoundingBox, initializeRenderer } from './utils'

/**
  ## Presentation

Viewer for [three.js](https://threejs.org/) [scenes](https://threejs.org/docs/#api/en/scenes/Scene). 


 ## Resources

 Various resources:
 -    [three.js](https://threejs.org/): the three. js library, on top of which is built this module 
 -    [three scene](https://threejs.org/docs/#api/en/scenes/Scene): the scene representation for three.js
 */
export namespace ModuleViewer{

    let svgIcon = `<path style="fill:#020202" d="M492.5,361.5H389.2c-12.4,0-22.5-10.1-22.5-22.5v-69.7c0-12.4,10.1-22.5,22.5-22.5h103.3  c12.4,0,22.5,10.1,22.5,22.5V339C515,351.4,504.9,361.5,492.5,361.5z M389.2,251.8c-9.6,0-17.5,7.9-17.5,17.5V339  c0,9.6,7.9,17.5,17.5,17.5h103.3c9.6,0,17.5-7.9,17.5-17.5v-69.7c0-9.6-7.9-17.5-17.5-17.5H389.2z"/>
    <g style="enable-background:new">
        <path d="M395.2,323.3c2.3,1.4,7.4,3.6,13,3.6c10.1,0,13.3-6.4,13.2-11.3c-0.1-8.2-7.5-11.7-15.1-11.7h-4.4v-5.9h4.4   c5.8,0,13.1-3,13.1-9.9c0-4.7-3-8.8-10.3-8.8c-4.7,0-9.2,2.1-11.7,3.9l-2.2-5.8c3.2-2.2,9.1-4.5,15.4-4.5c11.5,0,16.7,6.8,16.7,14   c0,6.1-3.7,11.3-10.8,13.9v0.2c7.2,1.4,13,6.8,13.1,14.9c0,9.4-7.4,17.6-21.3,17.6c-6.6,0-12.3-2.1-15.2-4L395.2,323.3z"/>
        <path d="M442.3,272.5c4.8-0.8,10.4-1.4,16.7-1.4c11.3,0,19.3,2.7,24.6,7.6c5.5,4.9,8.6,12,8.6,21.8c0,9.9-3.1,18-8.7,23.6   c-5.8,5.7-15.1,8.7-26.9,8.7c-5.7,0-10.3-0.3-14.2-0.7V272.5z M450.1,326.2c2,0.3,4.9,0.4,7.9,0.4c16.8,0,25.8-9.4,25.8-25.7   c0.1-14.3-8-23.4-24.6-23.4c-4.1,0-7.1,0.4-9.2,0.8V326.2z"/>
    </g>`

    /** Wrapper exposing available data for viewer's plugins.
     */
    export class PluginsGateway {

        /** When three.js scene is updated */
        scene$ = new ReplaySubject<Scene>(1)

        /** When flux scene is updated */
        fluxScene$ = new ReplaySubject<{old: FluxScene<Object3D>, updated: FluxScene<Object3D>}>(1)

        /* Rendering div updated */
        renderingDiv$ = new ReplaySubject<HTMLDivElement>(1)

        /* Control updated */
        controls$ = new ReplaySubject<TrackballControls>(1)

        mouseDown$ = new Subject<MouseEvent>() 
        mouseMove$  = new Subject<MouseEvent>() 
        mouseUp$  = new Subject<MouseEvent>() 
        click$  = new Subject<MouseEvent>() 
    }


    /**
     * ## Persistent Data  🔧
     *
     * Exposed properties are the attributes of this class.
     */
    @Schema({
        pack
    })
    export class PersistentData {

        /**
         * Background color of the viewer, hexadecimal representation
         */
        @Property({ description: "background color", type: "color" })
        readonly backgroundColor: string

        /**
         * Ambient light intensity
         */
        @Property({ description: "ambient light intensity", type: "float" })
        readonly ambientIntensity: number

        constructor({ backgroundColor, ambientIntensity }:
            { backgroundColor?: string, ambientIntensity?: number } =
            {}) {
            this.backgroundColor = backgroundColor ? backgroundColor : "0xFFFFFF"
            this.ambientIntensity = ambientIntensity ? ambientIntensity : 1
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
    * General documentation of this module provided [[ModuleViewer | here]].
    * 
    */
    @Flux({
        pack: pack,
        namespace: ModuleViewer,
        id: "ModuleViewer",
        displayName: "Viewer 3D",
        description: "3D viewer to display three.js scenes.",
        resources: {
            'technical doc': `${pack.urlCDN}/dist/docs/modules/lib_viewer_module.moduleviewer.html`
        }
    })
    @BuilderView({
        namespace: ModuleViewer,
        icon: svgIcon
    })
    @RenderView({
        namespace: ModuleViewer,
        render: (mdle: Module) => renderHtmlElement(mdle),
        wrapperDivAttributes: (_) => ({ style: { height: "100%", width: "100%" } })
    })
    export class Module extends ModuleFlux {

        pluginsGateway = new PluginsGateway()
        scene: Scene
        camera: PerspectiveCamera 
        renderer: WebGLRenderer
        controls: TrackballControls

        registeredRenderLoopActions: {[key:string]: {action:(Module)=>void, instance: unknown}} = {}
        
        fluxScene: FluxScene<Object3D> = createEmptyScene({
            id:(obj: Object3D ) => obj.name,
            add:(obj: Object3D ) => this.addObject(obj),
            remove:(obj: Object3D ) => this.removeObject(obj),  
            ready:() => this.scene != undefined
        })
        ctxBeforeInitialization : Context

        constructor( params ){
            super(params)

            this.ctxBeforeInitialization = new Context("Before renderer initialized", {}, this.logChannels)
            this.addJournal({title:"Before renderer initialized", entryPoint:this.ctxBeforeInitialization})

            this.addInput({
                id:'input',
                description: `Add 3D objects from incoming messages to the scene. If an object with same
                id is already in the scene it is replaced by the incoming one.`,
                contract: contract,
                onTriggered: ({data, configuration, context}) => {
                    this.render(data, context)
                }
            })
        }

        setRenderingDiv(renderingDiv: HTMLDivElement) {
            this.init(renderingDiv)
            this.pluginsGateway.renderingDiv$.next(renderingDiv)
        }

        addRenderLoopAction(uid: string, instance: unknown, action: (Module) => void) {
            this.registeredRenderLoopActions[uid] = { action: action, instance: instance }
        }

        removeRenderLoopAction(uid: string) {
            delete this.registeredRenderLoopActions[uid]
        }

        resize(renderingDiv: HTMLDivElement) {

            this.renderer.setSize(renderingDiv.clientWidth, renderingDiv.clientHeight);
            const camera = this.camera as PerspectiveCamera
            camera.aspect = renderingDiv.clientWidth / renderingDiv.clientHeight;
            camera.updateProjectionMatrix();
        }

        init(renderingDiv: HTMLDivElement) {

            let config = this.getPersistentData<PersistentData>()
            
            this.camera = new PerspectiveCamera(70, renderingDiv.clientWidth / renderingDiv.clientHeight, 0.01, 1000)
            this.camera.position.z = 10

            this.scene = new Scene()
            this.fluxScene = this.fluxScene.clearScene()
            this.scene.background = new Color(parseInt(config.backgroundColor));
            
            let lights = createDefaultLights(config.ambientIntensity)
            this.scene.add(lights)     

            try {
                const controls = new TrackballControls(this.camera, renderingDiv)
                this.controls = controls
                this.pluginsGateway.controls$.next(this.controls)   
                this.renderer = initializeRenderer({
                    renderingDiv,
                    scene: this.scene,
                    camera: this.camera,
                    controls: this.controls,
                    registeredRenderLoopActions: this.registeredRenderLoopActions,
                    viewerInstance: this
                })
            }
            catch (e) {
                console.error("Creation of webGl context failed")
                this.renderer = undefined
            }
            
            this.render(this.fluxScene.inCache, this.ctxBeforeInitialization)
        }

        addObject( object : Object3D ){
            // a pure instance of Object3D can be used to remove an object from the scene
            if( object.type != "Object3D" ){
                this.scene.add(object);
                this.pluginsGateway.scene$.next(this.scene)
            }
        }

        removeObject( object : Object3D ){

            this.scene.remove(object)
            this.pluginsGateway.scene$.next(this.scene)
        }

        render( objects: Array<Object3D>, context: Context ){

            let oldScene = this.fluxScene

            let fromBBox = this.scene && getSceneBoundingBox(this.scene)
            this.fluxScene = this.fluxScene.add(objects)
            fitSceneToContentIfNeeded(fromBBox, this.scene, this.camera, this.controls) 

            this.pluginsGateway.fluxScene$.next({old: oldScene, updated: this.fluxScene})

            if(!this.renderer)
                return 

            this.renderer.render(this.scene, this.camera);
    
            context.info("Scene updated", {
                scene:this.scene, 
                renderer: this.renderer, 
                fluxScene: { oldScene, newScene: this.fluxScene}
            })    

            if(context != this.ctxBeforeInitialization)
                context.terminate()     
        }
    }

    
    export function renderHtmlElement(mdle: Module) : HTMLElement {
        
        let vDOM : VirtualDOM = {
            class:"h-100 v-100",
            children:[
                {
                    class:"h-100 v-100",
                    connectedCallback: (div: HTMLDivElement) => {

                        div.addEventListener( 
                            'mousedown',
                            (e) => mdle.pluginsGateway.mouseDown$.next(e)
                            , false )
                        div.addEventListener( 
                            'click',
                            (e) => mdle.pluginsGateway.click$.next(e)
                            , false )
                        div.addEventListener( 
                            'mousemove',
                            (e) => mdle.pluginsGateway.mouseMove$.next(e)
                            , false )
                        
                        div.addEventListener( 
                            'mouseup',
                            (e) => mdle.pluginsGateway.mouseUp$.next(e)
                            , false )
                        setTimeout(() => {
                            mdle.setRenderingDiv(div)
                            let observer = new ResizeObserver(() => mdle.resize(div))
                            observer.observe(div)
                        }, 0)
                    }
                }
            ]
        }
        return render(vDOM)
    }
}