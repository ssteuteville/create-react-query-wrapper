const dts = require('rollup-plugin-dts').default;
const esbuild = require('rollup-plugin-esbuild').default;
// Rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */

module.exports.default = [
  {
    input: 'src/index.ts',
    plugins: [esbuild()],
    external: ['@tanstack/react-query'],
    output: [
      {
        file: 'dist/bundle.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    external: ['@tanstack/react-query'],
    output: {
      file: 'dist/bundle.d.ts',
      format: 'es',
    },
  },
];
