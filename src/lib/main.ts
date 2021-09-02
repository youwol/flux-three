import { FluxPack, Journal } from '@youwol/flux-core'
import { BufferGeometry, Mesh, Object3D } from 'three'
import { AUTO_GENERATED } from '../auto_generated'
import { geometryJournalView, object3DJournalView } from './journal.views'

export function install(){

    Journal.registerView({
        name:'Geometry-View @ flux-three',
        description:'Journal view to display three.js geometries',
        isCompatible: (data:unknown) => data instanceof BufferGeometry,
        view: (geometry: BufferGeometry) => {
            return geometryJournalView(geometry) as any
        }
    })
    Journal.registerView({
        name:'Object3D-View @ flux-three',
        description:'Journal view to display three.js Object3D',
        isCompatible: (data:unknown) => data instanceof Object3D,
        view: (object: Object3D) => {
            return object3DJournalView(object) as any
        }
    })
    return
}

export let pack = new FluxPack({
    ...AUTO_GENERATED,
    ...{
        install
    }
})

