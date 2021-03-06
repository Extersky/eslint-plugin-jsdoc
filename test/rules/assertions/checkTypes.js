export default {
  invalid: [
    {
      code: `
          /**
           * @param {Number} foo
           */
          function quux (foo) {

          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "Number"; prefer: "number".'
        }
      ],
      output: `
          /**
           * @param {number} foo
           */
          function quux (foo) {

          }
      `
    },
    {
      code: `
          /**
           * @arg {Number} foo
           */
          function quux (foo) {

          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @arg "foo" type "Number"; prefer: "number".'
        }
      ],
      output: `
          /**
           * @arg {number} foo
           */
          function quux (foo) {

          }
      `
    },
    {
      code: `
          /**
           * @returns {Number} foo
           * @throws {Number} foo
           */
          function quux () {

          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @returns type "Number"; prefer: "number".'
        },
        {
          line: 4,
          message: 'Invalid JSDoc @throws type "Number"; prefer: "number".'
        }
      ]
    },
    {
      code: `
          /**
           * @param {(Number|string|Boolean)=} foo
           */
          function quux (foo, bar, baz) {

          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "Number"; prefer: "number".'
        },
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "Boolean"; prefer: "boolean".'
        }
      ],
      output: `
          /**
           * @param {(number|string|boolean)=} foo
           */
          function quux (foo, bar, baz) {

          }
      `
    },
    {
      code: `
          /**
           * @param {Array<Number|String>} foo
           */
          function quux (foo, bar, baz) {

          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "Number"; prefer: "number".'
        },
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "String"; prefer: "string".'
        }
      ],
      output: `
          /**
           * @param {Array<number|string>} foo
           */
          function quux (foo, bar, baz) {

          }
      `
    },
    {
      code: `
          /**
           * @param {abc} foo
           */
          function qux(foo) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "abc"; prefer: "Abc".'
        }
      ],
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: 'Abc',
            string: 'Str'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {abc} foo
           */
          function qux(foo) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "abc"; prefer: "Abc".'
        }
      ],
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: {
              replacement: 'Abc'
            },
            string: 'Str'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {abc} foo
           */
          function qux(foo) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Messed up JSDoc @param "foo" type "abc"; prefer: "Abc".'
        }
      ],
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: {
              message: 'Messed up JSDoc @{{tagName}}{{tagValue}} type "{{badType}}"; prefer: "{{preferredType}}".',
              replacement: 'Abc'
            },
            string: 'Str'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {abc} foo
           * @param {cde} bar
           * @param {object} baz
           */
          function qux(foo, bar, baz) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Messed up JSDoc @param "foo" type "abc"; prefer: "Abc".'
        },
        {
          line: 4,
          message: 'More messed up JSDoc @param "bar" type "cde"; prefer: "Cde".'
        },
        {
          line: 5,
          message: 'Invalid JSDoc @param "baz" type "object"; prefer: "Object".'
        }
      ],
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: {
              message: 'Messed up JSDoc @{{tagName}}{{tagValue}} type "{{badType}}"; prefer: "{{preferredType}}".',
              replacement: 'Abc'
            },
            cde: {
              message: 'More messed up JSDoc @{{tagName}}{{tagValue}} type "{{badType}}"; prefer: "{{preferredType}}".',
              replacement: 'Cde'
            },
            object: 'Object'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {abc} foo
           */
          function qux(foo) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Messed up JSDoc @param "foo" type "abc".'
        }
      ],
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: {
              message: 'Messed up JSDoc @{{tagName}}{{tagValue}} type "{{badType}}".',
              replacement: false
            },
            string: 'Str'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {abc} foo
           */
          function qux(foo) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Messed up JSDoc @param "foo" type "abc".'
        }
      ],
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: {
              message: 'Messed up JSDoc @{{tagName}}{{tagValue}} type "{{badType}}".'
            },
            string: 'Str'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {abc} foo
           * @param {Number} bar
           */
          function qux(foo, bar) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "abc"; prefer: "Abc".'
        }
      ],
      options: [{
        noDefaults: true
      }],
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: 'Abc',
            string: 'Str'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {abc} foo
           * @param {Number} bar
           */
          function qux(foo, bar) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "abc"; prefer: "Abc".'
        },
        {
          line: 4,
          message: 'Invalid JSDoc @param "bar" type "Number"; prefer: "number".'
        }
      ],
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: 'Abc',
            string: 'Str'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {abc} foo
           */
          function qux(foo) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "abc".'
        }
      ],
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: false,
            string: 'Str'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {abc} foo
           */
          function qux(foo) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "abc".'
        }
      ],
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: false
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {*} baz
           */
          function qux(baz) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "baz" type "*".'
        }
      ],
      output: `
          /**
           * @param {*} baz
           */
          function qux(baz) {
          }
      `,
      settings: {
        jsdoc: {
          preferredTypes: {
            '*': false,
            abc: 'Abc',
            string: 'Str'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {*} baz
           */
          function qux(baz) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "baz" type "*"; prefer: "aaa".'
        }
      ],
      output: `
          /**
           * @param {aaa} baz
           */
          function qux(baz) {
          }
      `,
      settings: {
        jsdoc: {
          preferredTypes: {
            '*': 'aaa',
            abc: 'Abc',
            string: 'Str'
          }
        }
      }
    },
    {
      code: `
          /**
           * @param {abc} foo
           * @param {Number} bar
           */
          function qux(foo, bar) {
          }
      `,
      errors: [
        {
          line: 3,
          message: 'Invalid JSDoc @param "foo" type "abc"; prefer: "Abc".'
        },
        {
          line: 4,
          message: 'Invalid JSDoc @param "bar" type "Number"; prefer: "number".'
        }
      ],
      output: `
          /**
           * @param {Abc} foo
           * @param {Number} bar
           */
          function qux(foo, bar) {
          }
      `,
      settings: {
        jsdoc: {
          preferredTypes: {
            abc: 'Abc',
            string: 'Str'
          }
        }
      }
    }
  ],
  valid: [
    {
      code: `
          /**
           * @param {number} foo
           * @param {Bar} bar
           * @param {*} baz
           */
          function quux (foo, bar, baz) {

          }
      `
    },
    {
      code: `
          /**
           * @arg {number} foo
           * @arg {Bar} bar
           * @arg {*} baz
           */
          function quux (foo, bar, baz) {

          }
      `
    },
    {
      code: `
          /**
           * @param {(number|string|boolean)=} foo
           */
          function quux (foo, bar, baz) {

          }
      `
    },
    {
      code: `
          /**
           * @param {typeof bar} foo
           */
          function qux(foo) {
          }
      `
    },
    {
      code: `
          /**
           * @param {import('./foo').bar.baz} foo
           */
          function qux(foo) {
          }
      `
    },
    {
      code: `
          /**
           * @param {(x: number, y: string) => string} foo
           */
          function qux(foo) {
          }
      `
    },
    {
      code: `
          /**
           * @param {() => string} foo
           */
          function qux(foo) {
          }
      `
    },
    {
      code: `
          /**
           * @returns {Number} foo
           * @throws {Number} foo
           */
          function quux () {

          }
      `,
      options: [{
        noDefaults: true
      }]
    },
    {
      code: `
        /**
         * @param {Object} foo
         */
        function quux (foo) {

        }
      `,
      settings: {
        jsdoc: {
          preferredTypes: {
            object: 'Object'
          }
        }
      }
    }
  ]
};
