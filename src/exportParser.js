import debugModule from 'debug';

const debug = debugModule('requireExportJsdoc');

const createNode = function () {
  return {
    props: {}
  };
};

const getSymbolValue = function (symbol) {
  if (!symbol) {
    return null;
  }
  if (symbol.type === 'literal') {
    return symbol.value.value;
  }

  return null;
};

const getIdentifier = function (node, variables, globals, scope, opts) {
  if (opts.simpleIdentifier) {
    // Type is Identier for noncomputed properties
    const identifierLiteral = createNode();
    identifierLiteral.type = 'literal';
    identifierLiteral.value = {value: node.name};

    return identifierLiteral;
  }

  const block = scope || variables;

  // As only the topmost scope is handled, scopes are not traversed recursively
  if (block.props[node.name]) {
    return block.props[node.name];
  }
  if (variables.props[node.name]) {
    return variables.props[node.name];
  }
  if (globals.props[node.name]) {
    return globals.props[node.name];
  }

  return null;
};

let createSymbol = null;
const getSymbol = function (node, variables, globals, scope, opt) {
  const opts = opt || {};
  let block = scope;
  if (node.type === 'Identifier') {
    return getIdentifier(node, variables, globals, scope, opts);
  } else if (node.type === 'MemberExpression') {
    const obj = getSymbol(node.object, variables, globals, scope, opts);
    const propertySymbol = getSymbol(node.property, variables, globals, scope, {simpleIdentifier: !node.computed});
    const propertyValue = getSymbolValue(propertySymbol);

    if (obj && propertyValue && obj.props[propertyValue]) {
      block = obj.props[propertyValue];

      return block;
    } else if (opts.createMissingProps && propertyValue) {
      obj.props[propertyValue] = createNode();

      return obj.props[propertyValue];
    } else {
      debug('MemberExpression: Missing property ' + node.property.name);

      return null;
    }
  } else if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration' || node.type === 'ArrowFunctionExpression') {
    const val = createNode();
    val.props.prototype = createNode();
    val.props.prototype.type = 'object';
    val.type = 'object';
    val.value = node;

    return val;
  } else if (node.type === 'AssignmentExpression') {
    return createSymbol(node.left, variables, globals, node.right, scope, opts);
  } else if (node.type === 'ClassBody') {
    const val = createNode();
    node.body.forEach((method) => {
      val.props[method.key.name] = createNode();
      val.props[method.key.name].type = 'object';
      val.props[method.key.name].value = method.value;
    });
    val.type = 'object';
    val.value = node;

    return val;
  } else if (node.type === 'ObjectExpression') {
    const val = createNode();
    val.type = 'object';
    node.properties.forEach((prop) => {
      const propVal = getSymbol(prop.value, variables, globals, scope, opts);
      if (propVal) {
        val.props[prop.key.name] = propVal;
      }
    });

    return val;
  } else if (node.type === 'Literal') {
    const val = createNode();
    val.type = 'literal';
    val.value = node;

    return val;
  }

  return null;
};

createSymbol = function (node, variables, globals, value, scope) {
  const block = scope || globals;
  let symbol;
  if (node.type === 'Identifier') {
    if (value) {
      const valueSymbol = getSymbol(value, variables, globals, block);
      if (valueSymbol) {
        block.props[node.name] = valueSymbol;

        return block.props[node.name];
      } else {
        debug('Identifier: Missing value symbol for %s', node.name);
      }
    } else {
      block.props[node.name] = createNode();

      return block.props[node.name];
    }
  } else if (node.type === 'MemberExpression') {
    symbol = getSymbol(node.object, variables, globals, block);

    const propertySymbol = getSymbol(node.property, variables, globals, block, {simpleIdentifier: !node.computed});
    const propertyValue = getSymbolValue(propertySymbol);
    if (symbol && propertyValue) {
      symbol.props[propertyValue] = getSymbol(value, variables, globals, block);

      return symbol.props[propertyValue];
    } else {
      debug('MemberExpression: Missing symbol: %s', node.property.name);
    }
  } else if (node.type === 'FunctionDeclaration') {
    if (node.id.type === 'Identifier') {
      return createSymbol(node.id, variables, globals, node, variables);
    }
  }

  return null;
};

// Creates variables from variable definitions
const initVariables = function (node, variables, globals) {
  if (node.type === 'Program') {
    node.body.forEach((childNode) => {
      initVariables(childNode, variables, globals);
    });
  } else if (node.type === 'ExpressionStatement') {
    initVariables(node.expression, variables, globals);
  } else if (node.type === 'VariableDeclaration') {
    node.declarations.forEach((declaration) => {
      // let and const
      const symbol = createSymbol(declaration.id, variables, globals, null, variables);
      if (node.kind === 'var') {
        // If var, also add to globals
        globals.props[declaration.id.name] = symbol;
      }
    });
  }
};

// Populates variable maps using AST
const mapVariables = function (node, variables, globals) {
  if (node.type === 'Program') {
    node.body.forEach((childNode) => {
      mapVariables(childNode, variables, globals);
    });
  } else if (node.type === 'ExpressionStatement') {
    mapVariables(node.expression, variables, globals);
  } else if (node.type === 'AssignmentExpression') {
    createSymbol(node.left, variables, globals, node.right);
  } else if (node.type === 'VariableDeclaration') {
    node.declarations.forEach((declaration) => {
      createSymbol(declaration.id, variables, globals, declaration.init);
    });
  } else if (node.type === 'FunctionDeclaration') {
    if (node.id.type === 'Identifier') {
      createSymbol(node.id, variables, globals, node, variables);
    }
  } else if (node.type === 'ExportDefaultDeclaration') {
    const symbol = createSymbol(node.declaration, variables, globals, node.declaration);
    symbol.exported = true;
  } else if (node.type === 'ClassDeclaration') {
    createSymbol(node.id, variables, globals, node.body, variables);
  }
};

const findNode = function (node, block, cache) {
  let blockCache = cache || [];
  if (blockCache.indexOf(block) !== -1) {
    return false;
  }
  blockCache = blockCache.slice();
  blockCache.push(block);

  if (block.type === 'object') {
    if (block.value === node) {
      return true;
    }
  }
  for (const prop in block.props) {
    if (findNode(node, block.props[prop], blockCache)) {
      return true;
    }
  }

  return false;
};

const findExportedNode = function (block, node) {
  for (const key in block.props) {
    if (block.props[key].exported) {
      if (findNode(node, block)) {
        return true;
      }
    }
  }

  return false;
};

const isNodeExported = function (node, variables, globals, opt) {
  if (!opt.exportsOnly && globals.props.module && globals.props.module.props.exports) {
    if (findNode(node, globals.props.module.props.exports)) {
      return true;
    }
  }

  if (findExportedNode(globals, node)) {
    return true;
  }

  return findExportedNode(variables, node);
};

const parse = function (ast, opt) {
  const opts = opt || {
    exportsOnly: false,
    initModuleExports: true,
    initWindow: true
  };
  const vars = createNode();
  const globalVars = createNode();
  if (opts.initModuleExports) {
    globalVars.props.module = createNode();
    globalVars.props.module.props.exports = createNode();
  }
  if (opts.initWindow) {
    globalVars.props.window = globalVars;
  }
  initVariables(ast, vars, globalVars);
  mapVariables(ast, vars, globalVars);

  return {
    globalVars,
    vars
  };
};

const isExported = function (node, parseResult, opt) {
  return isNodeExported(node, parseResult.vars, parseResult.globalVars, opt);
};

export default {
  isExported,
  parse
};
