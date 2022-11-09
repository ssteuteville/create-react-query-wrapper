import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
// Rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */

export default [
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
