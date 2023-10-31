import Test from './test'

function createMapProps(typeName, type, componentName, options) {
  return {
    type,
    typeName,
    componentName,
    options
  }
}
function createMapPropsRender(name, options) {
  return {
    name,
    renderProps: true,
    options
  }
}

export default {
  key: 'test',
  mapping: [
    createMapProps('尺寸', 'size', 'RowInput', [
      createMapPropsRender('宽度', {
        type: 'number',
        placeholder: '宽度',
        value: Test.props.width.default,
        min: 0,
        max: 1000,
        step: 1,
        propKey: 'width'
      }),
      createMapPropsRender('高度', {
        type: 'number',
        placeholder: '高度',
        value: Test.props.height.default,
        min: 0,
        max: 1000,
        step: 1,
        propKey: 'height'
      })
    ])
  ]
}
