export default {
  invalid: [
    {
      code: `
          module.exports = function quux () {

          }
      `,
      errors: [
        {
          message: 'Missing JSDoc for exported declaration.'
        }
      ]
    },
    {
      code: `
          module.exports = {
            method: function() {

            }
          }
      `,
      errors: [
        {
          message: 'Missing JSDoc for exported declaration.'
        }
      ]
    },
    {
      code: `
          module.exports = {
            test: {
              test2: function() {

              }
            }
          }
      `,
      errors: [
        {
          message: 'Missing JSDoc for exported declaration.'
        }
      ]
    },
    {
      code: `
          const test = module.exports = function () {

          }
      `,
      errors: [
        {
          message: 'Missing JSDoc for exported declaration.'
        }
      ]
    },
    {
      code: `
          /**
          *
          */
          const test = module.exports = function () {

          }

          test.prototype.method = function() {}
      `,
      errors: [
        {
          message: 'Missing JSDoc for exported declaration.'
        }
      ]
    },
    {
      code: `
          const test = function () {

          }
          module.exports = {
            test: test
          }
      `,
      errors: [
        {
          message: 'Missing JSDoc for exported declaration.'
        }
      ]
    },
    {
      code: `
          const test = () => {

          }
          module.exports = {
            test: test
          }
      `,
      errors: [
        {
          message: 'Missing JSDoc for exported declaration.'
        }
      ]
    },
    {
      code: `
        class Test {
            method() {

            }
        }
        module.exports = Test;
      `,
      errors: [
        {
          message: 'Missing JSDoc for exported declaration.'
        }
      ]
    },
    {
      code: `
          export default function quux () {

          }
      `,
      errors: [
        {
          message: 'Missing JSDoc for exported declaration.'
        }
      ],
      parserOptions: {
        sourceType: 'module'
      }
    },
    {
      code: `
          function quux () {

          }
          export default quux;
      `,
      errors: [
        {
          message: 'Missing JSDoc for exported declaration.'
        }
      ],
      parserOptions: {
        sourceType: 'module'
      }
    }
  ],
  valid: [
    {
      code: `
          const test = {};
          /**
           * test
           */
          test.method = function () {

          }
          module.exports = {
            prop: { prop2: test.method }
          }
      `
    },
    {
      code: `
         /**
          *
          */
          function test() {

          }

          module.exports = {
            prop: { prop2: test }
          }
      `
    },
    {
      code: `
          /**
           *
           */
          test = function() {

          }

          module.exports = {
            prop: { prop2: test }
          }
      `
    },
    {
      code: `
          /**
           *
           */
          const test = () => {

          }

          module.exports = {
            prop: { prop2: test }
          }
      `
    },
    {
      code: `
          /**
           *
           */
          window.test = function() {

          }

          module.exports = {
            prop: window
          }
      `
    },
    {
      code: `
          test = function() {

          }

          /**
           *
           */
          test = function() {

          }

          module.exports = {
            prop: { prop2: test }
          }
      `
    },
    {
      code: `
          test = function() {

          }

          test = 2;

          module.exports = {
            prop: { prop2: test }
          }
      `
    },
    {
      code: `
          /**
           *
           */
          function test() {

          }

          /**
           *
           */
          test.prototype.method = function() {

          }

          module.exports = {
            prop: { prop2: test }
          }
      `
    },
    {
      code: `
        class Test {
            /**
             * Test
             */
            method() {

            }
        }
        module.exports = Test;
      `
    },
    {
      code: `
          /**
           *
           */
          export default function quux () {

          }
      `,
      parserOptions: {
        sourceType: 'module'
      }
    },
    {
      code: `
          /**
           *
           */
          function quux () {

          }
          export default quux;
      `,
      parserOptions: {
        sourceType: 'module'
      }
    }
  ]
};
