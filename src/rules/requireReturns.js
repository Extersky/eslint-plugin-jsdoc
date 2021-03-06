import iterateJsdoc from '../iterateJsdoc';

/**
 * We can skip checking for a return value, in case the documentation is inherited
 * or the method is either a constructor or an abstract method.
 *
 * In either of these cases the return value is optional or not defined.
 *
 * @param {*} utils
 *   a reference to the utils which are used to probe if a tag is present or not.
 * @returns {boolean}
 *   true in case deep checking can be skipped; otherwise false.
 */
const canSkip = (utils) => {
  return utils.hasATag([
    // inheritdoc implies that all documentation is inherited
    // see http://usejsdoc.org/tags-inheritdoc.html
    //
    // As we do not know the parent method, we cannot perform any checks.
    'inheritdoc',
    'override',

    // Different Tag similar story. Abstract methods are by definition incomplete,
    // so it is not an error if it declares a return value but does not implement it.
    'abstract',
    'virtual',

    // Constructors do not have a return value by definition (http://usejsdoc.org/tags-class.html)
    // So we can bail out here, too.
    'class',
    'constructor',

    // This seems to imply a class as well
    'interface',

    // While we may, in a future rule, err in the case of (regular) functions
    //  using @implements (see https://github.com/gajus/eslint-plugin-jsdoc/issues/201 ),
    //  this should not error for those using the tag to indicate implementation of
    //  a particular function signature
    'implements'
  ]) ||
    utils.isConstructor() ||

    // Though ESLint avoided getters: https://github.com/eslint/eslint/blob/master/lib/rules/valid-jsdoc.js#L435
    //  ... getters seem that they should, unlike setters, always return:
    utils.isSetter();
};

export default iterateJsdoc(({
  report,
  utils
}) => {
  // A preflight check. We do not need to run a deep check
  // in case the @returns comment is optional or undefined.
  if (canSkip(utils)) {
    return;
  }

  const tagName = utils.getPreferredTagName('returns');
  const tags = utils.getTags(tagName);

  if (tags.length > 1) {
    report('Found more than one  @' + tagName + ' declaration.');
  }

  // In case the code returns something, we expect a return value in JSDoc.
  const [tag] = tags;
  if (!utils.hasDefinedTypeReturnTag(tag) && utils.hasReturnValue() ||
    (typeof tag === 'undefined' || tag === null) && utils.isForceRequireReturn()
  ) {
    report('Missing JSDoc @' + tagName + ' declaration.');
  }
}, {
  meta: {
    type: 'suggestion'
  }
});
