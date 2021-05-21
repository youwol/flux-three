

import {Property, Flux,BuilderView, ModuleFlux, Pipe, Schema, freeContract, Context } from "@youwol/flux-core"
import {MeshStandardMaterial, FrontSide, DoubleSide, BackSide, Color} from 'three'
import { pack } from "./main"
import { Schemas } from "./schemas"



/**
 * ## Presentation
 * 
 * Creates a [standard material](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial) that can be applied
 * on 3D objects.
 *   
 *  ## Resources
 *
 * Various resources:
 * -    [three.js](https://threejs.org/): the three. js library, on top of which is built this module 
 * -    [three standard material](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial): 
 * the material representation for three.js
  */
export namespace ModuleStandardMaterial {

    //Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    let svgIcon = `<g xmlns="http://www.w3.org/2000/svg" id="020---Pallette" fill="rgb(0,0,0)" fill-rule="nonzero" transform="translate(0 -1)"><path id="Shape" d="m5.711 17.382c-7.64819582 9.8485393-7.58379562 23.6462833.156 33.423 4.7793826 6.0582119 11.9405981 9.759285 19.647 10.154.4933333.0266667.9853333.0403333 1.476.041 8.7256181.0191567 16.9174295-4.1990482 21.97-11.313l.843 8.422c.1644252 1.6406568 1.5451245 2.8899 3.194 2.8899s3.0295748-1.2492432 3.194-2.8899l2.67-26.7c.0977769-.9755846.0352848-1.9605942-.185-2.916l-1.976-8.58c2.0587829-1.3120206 3.3037015-3.5856947 3.3-6.027-.0623426-1.7628503-.5137895-3.4900958-1.322-5.058-.74-1.668-1.378-3.108-.924-5.215.2021877-.89015779-.1697654-1.81226676-.933-2.313-.6777169-.43954627-1.5611213-.39396422-2.19.113-5.81 4.476-8.631 8.557-8.631 12.473-.0031375 2.4411614 1.2416422 4.7145817 3.3 6.027l-1.02 4.426c-2.3282014-.5239485-4.7618561.192344-6.435 1.894l-4.94 4.94c-.9378817.9391914-2.2107086 1.4669339-3.538 1.4669339s-2.6001183-.5277425-3.538-1.4669339c-1.9447988-1.9573889-1.9447988-5.1176111 0-7.075l4.951-4.941c1.8812096-1.8654388 2.5354527-4.6395695 1.686-7.149-.849212-2.54963729-3.0772966-4.39233812-5.741-4.748-9.5507054-1.36286172-19.0987336 2.50078029-25.014 10.122zm50.08-14.34c.0178305.04872179.0206176.10167568.008.152-.4177416 2.20366462-.0471164 4.48405337 1.047 6.442.69405 1.3139647 1.0881722 2.7654545 1.154 4.25-.0067764.4935724-.0845744.9835987-.231 1.455-.3679636-.0256985-.7328118-.0849445-1.09-.177-1.4274237-.3909248-2.6737176-1.2676452-3.524-2.479-.207-.3-.39-.623-.575-.944-.3926309-.762971-.8983444-1.4622041-1.5-2.074-.3536313-.32474574-.7541147-.59443148-1.188-.8 1.6741321-2.21686286 3.6611809-4.17898509 5.899-5.825zm-7.791 10.844c.02714-1.1482412.3186933-2.2747594.852-3.292.3177019.1241277.6101403.3050804.863.534.4522872.4802212.8334883 1.0227256 1.132 1.611.21.365.422.73.661 1.08 1.1204061 1.6015796 2.7646002 2.7619583 4.649 3.281.2.053.4.082.6.12-.9280905 1.1189473-2.303279 1.7704873-3.757 1.78-2.7913372-.0351421-5.027784-2.3225799-5-5.114zm5 7.114c.6221955-.0021584 1.241205-.0889543 1.84-.258l1.89 8.2c0 .019 0 .039.008.058h-2.738c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h2.878c-.005.07 0 .14 0 .21l-2.678 26.7c-.0618316.6185759-.5823415 1.0896505-1.204 1.0896505s-1.1421684-.4710746-1.204-1.0896505l-2.67-26.7c-.007-.07 0-.14 0-.21h.878c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1h-.738c0-.019 0-.039.009-.058l1.889-8.2c.598795.1690457 1.2178045.2558416 1.84.258zm-18.436-8.356c.6230806 1.7888523.1553604 3.7766632-1.2 5.1l-4.953 4.943c-1.9999904 2.0042586-2.5967357 5.0154408-1.512277 7.6309644s3.6368439 4.3210009 6.468277 4.3220356c1.8570142.0038545 3.6383831-.7354118 4.947-2.053l4.94-4.94c1.1896713-1.2077444 2.916076-1.7201528 4.572-1.357l-.508 2.2c-.2201981.9557575-.2826886 1.9410817-.185 2.917l1.509 15.093c-4.1356267 7.1649732-11.5487901 11.8192421-19.7990324 12.4305936-8.2502424.6113515-16.268445-2.8994373-21.4149676-9.3765936-6.3661635-8.001998-7.21599386-19.0747716-2.14549738-27.9545281 5.07049648-8.8797566 15.03853648-13.77533673 25.16549738-12.3594719 1.9158122.24096052 3.519763 1.5674543 4.116 3.404z"/><path id="Shape" d="m20.134 12.031c-.3479109.1006306-.6142205.3815093-.696195.7342822s.0331996.7222977.3010917.9660236c.2678922.2437259.646628.3235559.9901033.2086942 2.9642376-.924023 6.0969588-1.1767996 9.171-.74.547038.0762153 1.0522847-.305462 1.1285-.8525s-.305462-1.0522847-.8525-1.1285c-3.366075-.4792218-6.7966532-.2018239-10.042.812z"/><path id="Shape" d="m18.5 26.771c2.2240488-.0004748 4.2289193-1.3403481 5.0800938-3.3950733.8511745-2.0547251.3811066-4.4198472-1.1910938-5.9929267-.3912937-.3912937-1.0257063-.3912937-1.417 0s-.3912937 1.0257063 0 1.417c.6564546.6563876 1.0252525 1.5466804 1.0252525 2.475s-.3687979 1.8186124-1.0252525 2.475c-1.3852362 1.321908-3.5647638 1.321908-4.95 0-.6564546-.6563876-1.0252525-1.5466804-1.0252525-2.475s.3687979-1.8186124 1.0252525-2.475c.3789722-.3923789.3735524-1.0160848-.0121814-1.4018186s-1.0094397-.3911536-1.4018186-.0121814c-1.5704428 1.5737454-2.0389571 3.9382024-1.1872853 5.9918869.8516718 2.0536846 2.8560074 3.3926401 5.0792853 3.3931131z"/><path id="Shape" d="m16.386 32.293c-.2510745-.2599566-.6228779-.3642126-.9725073-.2726972-.3496295.0915155-.6226744.3645604-.7141899.7141899-.0915154.3496294.0127406.7214328.2726972.9725073.6564546.6563876 1.0252525 1.5466804 1.0252525 2.475s-.3687979 1.8186124-1.0252525 2.475c-1.3852362 1.321908-3.5647638 1.321908-4.95 0-.65645457-.6563876-1.02525254-1.5466804-1.02525254-2.475s.36879797-1.8186124 1.02525254-2.475c.2599566-.2510745.3642126-.6228779.2726972-.9725073-.0915155-.3496295-.36456044-.6226744-.71418988-.7141899-.34962943-.0915154-.72143285.0127406-.97250732.2726972-1.57304017 1.5729696-2.04364208 3.938637-1.19236105 5.9938764.85128103 2.0552395 2.85679625 3.3952982 5.08136105 3.3952982s4.23008-1.3400587 5.0813611-3.3952982c.851281-2.0552394.3806791-4.4209068-1.1923611-5.9938764z"/><path id="Shape" d="m36.5 49c2.2244881-.0000706 4.2299074-1.3401018 5.0811726-3.3952647.8512652-2.055163.3807427-4.4207494-1.1921726-5.9937353-.3923789-.3789722-1.0160848-.3735524-1.4018186.0121814s-.3911536 1.0094397-.0121814 1.4018186c.6564546.6563876 1.0252525 1.5466804 1.0252525 2.475s-.3687979 1.8186124-1.0252525 2.475c-1.3852362 1.321908-3.5647638 1.321908-4.95 0-.6564546-.6563876-1.0252525-1.5466804-1.0252525-2.475s.3687979-1.8186124 1.0252525-2.475c.3789722-.3923789.3735524-1.0160848-.0121814-1.4018186s-1.0094397-.3911536-1.4018186-.0121814c-1.5729153 1.5729859-2.0434378 3.9385723-1.1921726 5.9937353.8512652 2.0551629 2.8566845 3.3951941 5.0811726 3.3952647z"/><path id="Shape" d="m24.972 44.611c-.3903819.3904999-.3903819 1.0235001 0 1.414.6564546.6563876 1.0252525 1.5466804 1.0252525 2.475s-.3687979 1.8186124-1.0252525 2.475c-1.3852362 1.321908-3.5647638 1.321908-4.95 0-.6564546-.6563876-1.0252525-1.5466804-1.0252525-2.475s.3687979-1.8186124 1.0252525-2.475c.3789722-.3923789.3735524-1.0160848-.0121814-1.4018186s-1.0094397-.3911536-1.4018186-.0121814c-1.5730402 1.5729696-2.0436421 3.938637-1.1923611 5.9938764.8512811 2.0552395 2.8567963 3.3952982 5.0813611 3.3952982s4.23008-1.3400587 5.0813611-3.3952982c.851281-2.0552394.3806791-4.4209068-1.1923611-5.9938764-.3904999-.3903819-1.0235001-.3903819-1.414 0z"/></g>`

    /**
     * ## Persistent Data  🔧
     *
     * Exposed properties are the attributes of this class.
     */
    @Schema({
        pack: pack
    })
    export class PersistentData extends Schemas.StandardMaterialConfiguration{

        @Property({ description: "emit initial value" })
        readonly emitInitialValue : boolean

        constructor( {emitInitialValue, ...others} : any = {}
            ) {
            super(others)
            this.emitInitialValue = emitInitialValue != undefined ? emitInitialValue : true
        }
    }

    @Flux({
        pack:           pack,
        namespace:      ModuleStandardMaterial,
        id:             "ModuleStandardMaterial",
        displayName:    "Material",
        description:    "Standard material to apply on 3D objects",
        resources: {
            'technical doc': `${pack.urlCDN}/dist/docs/modules/lib_standard_material_module.modulestandardmaterial.html`
        }
    })
    @BuilderView({
        namespace:      ModuleStandardMaterial,
        icon:           svgIcon
    })
    export class Module extends ModuleFlux {
        
        output$ : Pipe<any>

        constructor(params){ 
            super(params)    
                    
            this.output$ = this.addOutput()

            this.addInput({
                id:"configuration",
                description: 'Input used to emit dynamic configuration',
                contract: freeContract(),
                onTriggered: ( {configuration, context}:{configuration: PersistentData, context: Context}) => {
                    this.emitMaterial(configuration, context)
                }
            })
            let defaultPersistentData = this.getPersistentData<PersistentData>()
            if(defaultPersistentData.emitInitialValue){
                let context = new Context(
                    'Default material creation',
                    {},
                    this.logChannels 
                )
                this.addJournal({
                    title: `Material created at construction because emitInitialValue is set to true`,
                    entryPoint: context
                })

                this.emitMaterial(defaultPersistentData, context) 
            }
        }

        emitMaterial( configuration: PersistentData, context: Context){

            let side = DoubleSide
            if(configuration.side=="FrontSize")
                side = FrontSide
        
            if(configuration.side=="BackSide")
                side = BackSide

            let properties = { 
                transparent:        configuration.transparent,
                opacity:            configuration.opacity,
                depthTest:          configuration.depthTest,
                depthWrite:         configuration.depthWrite,
                visible:            configuration.visible,
                side:               side,
                color:              configuration.color.includes("0x") ? parseInt(configuration.color) : new Color(configuration.color),
                emissive:           configuration.emissive.includes("0x") ? parseInt(configuration.emissive) : new Color(configuration.emissive),
                roughness:          configuration.roughness,
                metalness:          configuration.metalness,
                flatShading:        configuration.flatShading,
                wireframe:          configuration.wireframe,
                wireframeLinewidth: configuration.wireframeLinewidth 
            }
            let material = new MeshStandardMaterial( properties )
            
            this.output$.next({data: material, configuration:{}, context})
            context.terminate()
        }
    }
}
