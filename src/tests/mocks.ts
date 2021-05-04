
class MockResizeObserver{
    observe(){}
};

window['ResizeObserver'] = MockResizeObserver as any

