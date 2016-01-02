const {findVariable, variablesInScope} = require('eslint-plugin-react/lib/util/variable')
const htmlTags = require('html-tags')
const svgTags = require('svg-tags')

const standardTags = new Set(htmlTags.concat(svgTags))

/**
 * Check the factory function is imported if JSX is being used
 */

const factoryInScopeRule = context => {
  const config = context.options[0] || {}
  const name = config.pragma || 'JSX'
  return {
    JSXOpeningElement: function(node) {
      var variables = variablesInScope(context)
      if (findVariable(variables, name)) return
      context.report({
        message: `'${name}' must be in scope when using JSX syntax`,
        node: node
      })
    }
  }
}

factoryInScopeRule.schema = [{
  type: 'object',
  properties: {
    pragma: {type: 'string'}
  },
  additionalProperties: false
}]

/**
 * Prevent the JSX factory function from being marked as unused
 * if it will be in the compiled source
 */

const usesFactoryRule = context => {
  const config = context.options[0] || {}
  const id = config.pragma || 'JSX'
  return {
    JSXElement() {
      context.markVariableAsUsed(id)
    }
  }
}

usesFactoryRule.schema = factoryInScopeRule.schema

/**
 * Prevent variables used in JSX to be marked as unused
 */

const markUsedRule = context => {
  return {
    JSXOpeningElement(node) {
      var name = node.name
      if (name.type == 'JSXMemberExpression') name = name.object
      if (name.type == 'JSXNamespacedName') name = name.namespace
      context.markVariableAsUsed(name.name)
    },
    JSXAttribute(attr) {
      if (attr.value == null) context.markVariableAsUsed(attr.name.name)
    }
  }
}

/**
 * Disallow undeclared variables in JSX
 */

const noUndefRule = context => {
  return {
    JSXOpeningElement(node) {
      var name = node.name
      if (name.type == 'JSXMemberExpression') name = name.object
      if (name.type == 'JSXNamespacedName') name = name.namespace
      const variables = variablesInScope(context)
      node.attributes.forEach(attr => {
        if (attr.type == 'JSXSpreadAttribute') return
        if (attr.value == null) checkDefined(context, variables, attr.name)
      })
      if (!standardTags.has(name.name)) checkDefined(context, variables, name)
    }
  }
}

const checkDefined = (context, variables, node) => {
  if (findVariable(variables, node.name)) return
  context.report({
    message: `'${node.name}' is not defined`,
    node: node
  })
}

const rules = {
  'uses-factory': usesFactoryRule,
  'factory-in-scope': factoryInScopeRule,
  'mark-used-vars': markUsedRule,
  'no-undef': noUndefRule
}

// enable all by default
const rulesConfig = {
  'uses-factory': 1,
  'factory-in-scope': 1,
  'mark-used-vars': 1,
  'no-undef': 1
}

export {rules,rulesConfig}
