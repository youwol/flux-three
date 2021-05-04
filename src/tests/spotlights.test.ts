

import * as operators from 'rxjs/operators'
import {instantiateModules, instantiatePlugins, parseGraph, renderTemplate, Runner} from "@youwol/flux-core"
import { ModuleSphere, ModuleStandardMaterial, ModuleViewer } from '../index'
import {Scene } from 'three'
import { PluginSpotlights } from '../lib/spotlights.module'

import './mocks'

console.log = () => {}

test('ViewerModule', (done) => {

    let branches = [
        '|~material~|-----|~shape~|------|~viewer~|',
        '                 |~spots~|               '
    ]
    
    let modules = instantiateModules({
        material:      [ModuleStandardMaterial, {wireframe: true}],     
        shape:         ModuleSphere,     
        viewer :       ModuleViewer,
    })
    let plugins = instantiatePlugins({
        spots:         [PluginSpotlights, modules.viewer]
    })
    let graph       = parseGraph( { branches, modules, plugins }  )

    new Runner( graph ) 

    let div = document.createElement('div') 
    div.innerHTML = '<div id="viewer"></div>'
    document.body.appendChild(div)
    renderTemplate(div, Object.values(modules))

    modules.viewer.pluginsGateway.scene$.pipe(
        operators.take(1)
    ).subscribe( (scene:Scene) => { 
        expect(scene.children[2].name).toEqual(`fluxThree_spotlights_${plugins.spots.moduleId}`)
        plugins.spots.dispose()
    })

    modules.viewer.pluginsGateway.scene$.pipe(
        operators.skip(1),
        operators.take(1)
    ).subscribe( (scene:Scene) => { 
        expect(scene.children.length).toEqual(2)
        done()
    })
})
