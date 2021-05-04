
import * as operators from 'rxjs/operators'
import {instantiateModules, parseGraph, Runner} from "@youwol/flux-core"
import { ModuleBox, ModuleCylinder, ModulePlane, ModuleSphere, ModuleStandardMaterial, ModuleViewer } from '../index'
import { BoxBufferGeometry, CylinderBufferGeometry, PlaneBufferGeometry, SphereBufferGeometry } from 'three'


console.log = () => {}

export function testSimpleShape( {ShapeType, ThreeType, objectId, config, done, geometryTest}){

    let branches = [
        '|~shape~|------|~Viewer~|'
    ]
    
    let modules = instantiateModules({
        shape:          [ShapeType, config],     
        Viewer :      ModuleViewer,
    })
    
    let graph       = parseGraph( { branches, modules } )
    expect(modules.shape.configuration.data.objectId).toEqual(objectId)
    expect(modules.shape.configuration.data.emitInitialValue).toBeTruthy()    

    new Runner( graph ) 

    modules.Viewer.pluginsGateway.fluxScene$.pipe(
        operators.take(1)
    ).subscribe( ({old, updated}) => {       
        let cache = updated.inCache
        expect(cache.length).toEqual(1)
        let shape = cache[0]
        
        expect(shape).toBeDefined()
        expect(shape.geometry).toBeInstanceOf(ThreeType)
        expect(shape.name).toEqual(objectId)
        geometryTest(shape),
        expect(shape.material).toBeDefined()
        done()
    })
}


test('ModuleBox', (done) => {

    testSimpleShape( {
        ShapeType: ModuleBox,
        ThreeType: BoxBufferGeometry,
        objectId:"boxGeometry",
        config:{widthCount:2, heightCount:3, depthCount:4}, 
        geometryTest: (shape) => expect(shape.geometry.attributes.position.count).toEqual(94),
        done
    })
})


test('ModuleSphere', (done) => {

    testSimpleShape( {
        ShapeType: ModuleSphere,
        ThreeType: SphereBufferGeometry,
        objectId:"sphereGeometry",
        config:{radius:2, widthCount:5, heightCount:6}, 
        geometryTest: (shape) => {
            expect(shape.geometry.attributes.position.count).toEqual(42)
        },
        done
    })
})

test('ModuleCylinder', (done) => {

    testSimpleShape( {
        ShapeType: ModuleCylinder,
        ThreeType: CylinderBufferGeometry,
        objectId:"cylinderGeometry",
        config:{radiusTop:2, radialCount:10, heightCount:6}, 
        geometryTest: (shape) => {
            expect(shape.geometry.attributes.position.count).toEqual(119)
        },
        done
    })
})

test('ModulePlane', (done) => {

    testSimpleShape( {
        ShapeType: ModulePlane,
        ThreeType: PlaneBufferGeometry,
        objectId:"planeGeometry",
        config:{ widthCount:10, heightCount:6}, 
        geometryTest: (shape) => {
            expect(shape.geometry.attributes.position.count).toEqual(77)
        },
        done
    })
})
/*

test('a box in a viewer, overided conf', (done) => {

    let branches = [
        '|~box~|---------------------------|~Viewer~|'
    ]
    
    let modules = instantiateModules({
        box:          [BoxGeometry, {emitInitialValue: false, classes:"Object3D BoxGeometry2", transform:{scaling:{x:2}}}],     
        Viewer :      Viewer,
    })
    let observers   = {}
    let adaptors    = {}
    let graph       = parseGraph( { branches, modules, adaptors, observers } )
    expect(modules.box.configuration.data.objectId).toEqual("boxGeometry")
    expect(modules.box.configuration.data.classes).toEqual("Object3D BoxGeometry2")
    expect(modules.box.configuration.data.emitInitialValue).toBeFalsy()
    expect(modules.box.configuration.data.transform.scaling.x).toEqual(2)
    expect(modules.box.configuration.data.transform.scaling.y).toEqual(1)
    done()
})

test('a graph2D in a viewer, overided conf', (done) => {

    let branches = [
        '|~box~|---------------------------|~Viewer~|'
    ]
    
    let modules = instantiateModules({
        box:          [Graph2D, {emitInitialValue: false, classes:"Object3D Graph2D", grid:{xAxis:{max:2}}}],     
        Viewer :      Viewer,
    })
    let observers   = {}
    let adaptors    = {}
    let graph       = parseGraph( { branches, modules, adaptors, observers } )
    expect(modules.box.configuration.data.objectId).toEqual("graph2D")
    expect(modules.box.configuration.data.classes).toEqual("Object3D Graph2D")
    expect(modules.box.configuration.data.emitInitialValue).toBeFalsy()
    expect(modules.box.configuration.data.transform.scaling.x).toEqual(1)
    expect(modules.box.configuration.data.transform.scaling.y).toEqual(1)
    expect(modules.box.configuration.data.grid.xAxis.max).toEqual(2)
    expect(modules.box.configuration.data.grid.xAxis.min).toEqual(-1)
    expect(modules.box.configuration.data.grid.yAxis.max).toEqual(1)
    expect(modules.box.configuration.data.grid.yAxis.min).toEqual(-1)
    done()
})

test('an implicit geometry in a viewer, overided conf', (done) => {

    let branches = [
        '|~box~|---------------------------|~Viewer~|'
    ]
    
    let modules = instantiateModules({
        box:          [ImplicitGeometry, {emitInitialValue: false, classes:"Object3D tutu", grid:{xAxis:{max:2}}}],     
        Viewer :      Viewer,
    })
    let observers   = {}
    let adaptors    = {}
    let graph       = parseGraph( { branches, modules, adaptors, observers } )
    expect(modules.box.configuration.data.objectId).toEqual("implicitGeometry")
    expect(modules.box.configuration.data.classes).toEqual("Object3D tutu")
    expect(modules.box.configuration.data.emitInitialValue).toBeFalsy()
    expect(modules.box.configuration.data.transform.scaling.x).toEqual(1)
    expect(modules.box.configuration.data.transform.scaling.y).toEqual(1)
    expect(modules.box.configuration.data.grid.xAxis.max).toEqual(2)
    expect(modules.box.configuration.data.grid.xAxis.min).toEqual(-1)
    expect(modules.box.configuration.data.grid.yAxis.max).toEqual(1)
    expect(modules.box.configuration.data.grid.yAxis.min).toEqual(-1)
    expect(modules.box.configuration.data.grid.zAxis.max).toEqual(1)
    expect(modules.box.configuration.data.grid.zAxis.min).toEqual(-1)
    done()
})


test('an implicit geometry in a viewer, overided conf', (done) => {

    let branches = [
        '|~box~|---------------------------|~Viewer~|'
    ]
    
    let modules = instantiateModules({
        box:          [ParametricGeometry, {emitInitialValue: false, classes:"Object3D tutu", stacksCount:50}],     
        Viewer :      Viewer,
    })
    let observers   = {}
    let adaptors    = {}
    let graph       = parseGraph( { branches, modules, adaptors, observers } )
    expect(modules.box.configuration.data.objectId).toEqual("parametricGeometry")
    expect(modules.box.configuration.data.classes).toEqual("Object3D tutu")
    expect(modules.box.configuration.data.emitInitialValue).toBeFalsy()
    expect(modules.box.configuration.data.stacksCount).toEqual(50)
    expect(modules.box.configuration.data.slicesCount).toEqual(25)
    
    done()
})
*/