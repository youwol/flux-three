import { FluxPack, Journal } from '@youwol/flux-core'
import { BufferGeometry, Mesh } from 'three'
import { AUTO_GENERATED } from '../auto_generated'
import { geometryJournalView } from './journal.views'

export function install(){

    Journal.registerView({
        name:'Mesh-View @ flux-three',
        description:'Journal view to display three.js Mesh',
        isCompatible: (data:unknown) => data instanceof BufferGeometry || data instanceof Mesh,
        view: (geometry: BufferGeometry | Mesh) => {

            return geometryJournalView(geometry) as any
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

