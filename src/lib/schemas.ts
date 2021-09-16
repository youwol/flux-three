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

        constructor({ x, y, z }: { x?: number, y?: number, z?: number } = {}) {
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

        constructor({ x, y, z }: { x?: number, y?: number, z?: number } = {}) {
            super({
                x: x != undefined ? x : 1,
                y: y != undefined ? y : 1,
                z: z != undefined ? z : 1
            })
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

        constructor({ translation, rotation, scaling }: { translation?: Object, rotation?: Object, scaling?: Object } = {}) {
            this.rotation = rotation != undefined ? new Rotation(rotation) : new Rotation()
            this.translation = translation != undefined ? new Translation(translation) : new Translation()
            this.scaling = scaling != undefined ? new Scaling(scaling) : new Scaling()
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


        constructor({ objectId, objectName, transform }: { objectId?: string, objectName?: string, transform?: Object }
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
        readonly emitInitialValue: boolean

        constructor({ emitInitialValue, ...others }:
            { emitInitialValue?: boolean, others?: any }
            = {}) {
            super(others as any)
            this.emitInitialValue = emitInitialValue != undefined ? emitInitialValue : true
        }
    }

    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    @Schema({
        pack 
    })
    export class MaterialAdvancedConfiguration{

        @Property({
            description: "front, back or both sides",
            enum: ["FrontSide", "BackSide", "DoubleSide"]
        })
        readonly side: string = "DoubleSide"

        @Property({ description: "Whether to have depth test enabled when rendering this material." })
        readonly depthTest: boolean = true

        @Property({ description: "Whether rendering this material has any effect on the depth buffer." })
        readonly depthWrite: boolean = true

        constructor(params:{side?: string, depthTest?: boolean, depthWrite?: boolean} = {}) {
            Object.assign(this, params)
        }
    }

    @Schema({
        pack: pack
    })
    export class MaterialVisibilityConfiguration {

        transparent: boolean

        @Property({
            description: "opacity if transparent property is true",
            min: 0,
            max: 1
        })
        readonly opacity: number

        @Property({ description: "opacity if transparent property is true" })
        readonly visible: boolean

        constructor({ opacity, visible }: any = {}
        ) {
            this.opacity = (opacity != undefined) ? opacity : 1
            this.visible = (visible != undefined) ? visible : true
            this.transparent = this.opacity < 1
        }
    }

    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------

    @Schema({
        pack: pack
    })
    export class MaterialShadingConfiguration {

        @Property({
            description: "emissive color",
            type: 'color'
        })
        readonly emissive: string = "0x0"

        @Property({
            description: "emissive intensity",
            min: 0,
            max: 10
        })
        readonly emissiveIntensity: number = 1

        @Property({
            description: "roughness",
            min: 0,
            max: 1
        })
        readonly roughness: number = 0.2

        @Property({
            description: "metalness",
            min: 0,
            max: 1
        })
        readonly metalness: number = 0.3

        @Property({ description: "flatShading" })
        readonly flatShading: boolean

        constructor(params: {
            emissive?: string,
            emissiveIntensity?: number,
            roughness?: number,
            metalness?: number,
            flatShading?: boolean
        } = {}) {

            Object.assign(this, params)

        }

    }

    @Schema({
        pack: pack
    })
    export class StandardMaterialConfiguration /*extends MaterialConfiguration*/ {

        @Property({
            description: "color",
            type: "color"
        })
        readonly color: string = "0x3399ff"

        @Property({
           description: "shading",
        }) 
        readonly shading: MaterialShadingConfiguration = new MaterialShadingConfiguration()

        @Property({ description: "wireframe" })
        readonly wireframe: boolean = false

        @Property({
            description: "wireframe line width",
            min: 0,
            max: 10
        })
        readonly wireframeLinewidth: number = 1


        @Property({
            description: "Visibility",
         }) 
        readonly visibility: MaterialVisibilityConfiguration = new MaterialVisibilityConfiguration()


        @Property({
            description: "Advanced",
         }) 
        readonly advanced: MaterialAdvancedConfiguration = new MaterialAdvancedConfiguration()


        constructor({ color, shading, wireframe, wireframeLinewidth, visibility, advanced, ...others }: {
            color?: string,
            shading?: MaterialShadingConfiguration,
            wireframe?: boolean,
            wireframeLinewidth?: number,
            visibility?: MaterialVisibilityConfiguration,
            advanced?: MaterialAdvancedConfiguration
        } = {}) {

            if (color != undefined)
                this.color = color
            if (shading != undefined)
                this.shading = new MaterialShadingConfiguration(shading)
            if (wireframe != undefined)
                this.wireframe = wireframe
            if (wireframeLinewidth != undefined)
                this.wireframeLinewidth = wireframeLinewidth
            if (visibility != undefined)
                this.visibility = new MaterialVisibilityConfiguration(visibility)
            if (advanced != undefined)
                this.advanced = new MaterialAdvancedConfiguration(advanced)

        }
    }
}