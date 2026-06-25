import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const PORT = parseInt(env.VITE_APP_PORT || '8080', 10);

  return {
    plugins: [
      react(),
      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
          dev: { logLevel: ['error'] },
        },
        overlay: {
          position: 'tl',
          initialIsOpen: false,
        },
      }),
    ],
    resolve: {
      alias: [
        { find: /^src(.+)/, replacement: path.resolve(process.cwd(), 'src/$1') },
        { find: '@auth', replacement: path.resolve(__dirname, 'src/auth') },
        { find: '@common', replacement: path.resolve(__dirname, 'src/common') },
        { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@locales', replacement: path.resolve(__dirname, 'src/locales') },
        { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
        { find: '@routes', replacement: path.resolve(__dirname, 'src/routes') },
        { find: '@services', replacement: path.resolve(__dirname, 'src/services') },
        { find: '@theme', replacement: path.resolve(__dirname, 'src/theme') },
      ],
    },
    server: { port: PORT, host: true },
    preview: { port: PORT, host: true },
  };
});
