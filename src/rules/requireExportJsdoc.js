import _ from 'lodash';
import iterateJsdoc from '../iterateJsdoc';
import exportParser from '../exportParser';

export default iterateJsdoc(({
  context,
  report,
  functionNode,
  sourceCode,
  jsdocNode
}) => {
  if (jsdocNode) {
    return;
  }

  let exportsOnly = false;
  if (_.has(context.options, 0)) {
    exportsOnly = context.options[0] === 'exportsOnly';
  }
  const opt = {
    exportsOnly,
    initModuleExports: true,
    initWindow: true
  };
  const parseResult = exportParser.parse(sourceCode.ast, opt);
  const exported = exportParser.isExported(functionNode, parseResult, opt);

  if (exported && !jsdocNode) {
    report('Missing JSDoc for exported declaration.');
  }
}, {iterateAll: true});
