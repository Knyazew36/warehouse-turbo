import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'
import tailwindcss from '@tailwindcss/vite'

// Определяем порты для разных режимов
const getPort = () => {
  const mode = process.env.NODE_ENV || 'development'
  const customPort = process.env.VITE_PORT || process.env.PORT

  if (customPort) {
    return parseInt(customPort)
  }

  switch (mode) {
    case 'development':
      return 5172
    case 'production':
      return 5173
    case 'preview':
      return 5172
    default:
      return 5173
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/reactjs-template/',
  base: '/test/',

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  plugins: [
    // Allows using React dev server along with building a React application with Vite.
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react(),
    // Allows using the compilerOptions.paths property in tsconfig.json.
    // https://www.npmjs.com/package/vite-tsconfig-paths
    tsconfigPaths(),
    // Creates a custom SSL certificate valid for the local machine.
    // Using this plugin requires admin rights on the first dev-mode launch.
    // https://www.npmjs.com/package/vite-plugin-mkcert
    mkcert(),
    tailwindcss()
  ],
  build: {
    target: 'esnext'
  },
  publicDir: './public',
  server: {
    port: getPort(),
    host: true
  },
  preview: {
    port: getPort(),
    host: true
  }
})
