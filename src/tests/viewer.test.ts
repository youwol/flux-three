

import * as operators from 'rxjs/operators'
import {instantiateModules, parseGraph, renderTemplate, Runner} from "@youwol/flux-core"
import { ModuleSphere, ModuleStandardMaterial, ModuleViewer } from '../index'
import { Mesh } from 'three'
import './mocks'

console.log = () => {}

test('ViewerModule', (done) => {

    let branches = [
        '|~material~|-----|~shape~|------|~viewer~|'
    ]
    
    let modules = instantiateModules({
        material:      [ModuleStandardMaterial, {wireframe: true}],     
        shape:         ModuleSphere,     
        viewer :       ModuleViewer,
    })
    
    let graph       = parseGraph( { branches, modules }  )

    new Runner( graph ) 

    modules.viewer.pluginsGateway.fluxScene$.pipe(
        operators.take(1)
    ).subscribe( ({old, updated}) => {       
        expect(updated.inCache.length).toEqual(1)
        expect(updated.inScene.length).toEqual(0)
       
        expect(updated.inCache[0]).toBeInstanceOf(Mesh)
        expect(updated.inCache[0].material.wireframe).toBeTruthy()
    })
    let div = document.createElement('div') 
    div.innerHTML = '<div id="viewer"></div>'
    document.body.appendChild(div)
    renderTemplate(div, Object.values(modules))

    modules.viewer.pluginsGateway.fluxScene$.pipe(
        operators.skip(1),
        operators.take(1)
    ).subscribe( ({old, updated}) => {  
        expect(old.inScene.length).toEqual(0)  
        expect(updated.inScene.length).toEqual(1)     
        done()
    })
})
