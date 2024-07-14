import { defineConfig, loadEnv, UserConfigExport } from 'vite'
import { readFileSync } from 'fs';
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const config: UserConfigExport = {
    build: {
      outDir: './build',
      emptyOutDir: true,
    },
    worker: {
      format: 'es'
    },
    optimizeDeps: {
      force: true
    },
    plugins: [
      react(),
      // svgr()
    ]
  };
  if (command === 'serve') {
    config.clearScreen = false;
    config.server = {
      https: getHttpsConfig(env),
      // proxy: createProxyConfig(env),
      host: '0.0.0.0',
      port: 3000
    };
  }
  return config;
});

function getHttpsConfig(env: Record<string, string>) {
  const crtPath = env.SSL_CRT_FILE;
  const keyPath = env.SSL_KEY_FILE;
  if (!crtPath || !keyPath) return undefined;
  return {
    cert: readFileSync(crtPath),
    key: readFileSync(keyPath)
  };
}