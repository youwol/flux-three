
import * as operators from 'rxjs/operators'
import {Context, instantiateModules, Journal, parseGraph, Runner} from "@youwol/flux-core"
import { install, ModuleBox, ModuleCylinder, ModulePlane, ModuleSphere, ModuleStandardMaterial, ModuleViewer } from '../index'
import { BoxBufferGeometry, CylinderBufferGeometry, Mesh, MeshStandardMaterial, PlaneBufferGeometry, Scene, SphereBufferGeometry } from 'three'
import { render } from '@youwol/flux-view'



console.log = () => {}

test('test buffer geometry journal view', (done) => {

    install()
    let ctx = new Context("testBufferGeomView", {})
    let journal = new Journal({
        title:"test for BufferGeometry journal View", 
        entryPoint: ctx
    })
    let buffer =  new SphereBufferGeometry()
    ctx.info("Buffer geometry", buffer)
    expect(true).toBeTruthy()
    let widget = Journal.getViews(buffer)
    expect(widget.length).toEqual(1)

    let div = render(widget[0].view)
    document.body.appendChild(div)

    expect(div['threeScene']).toBeDefined()
    let scene = div['threeScene'] as Scene
    
    expect(scene.children[0]).toBeInstanceOf(Mesh)
    let mesh = scene.children[0] as Mesh
    expect(mesh.geometry).toBeInstanceOf(SphereBufferGeometry)
    expect(mesh.material).toBeInstanceOf(MeshStandardMaterial)

    done()
})
