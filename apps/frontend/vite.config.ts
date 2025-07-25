import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  // base: '/reactjs-template/',

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
    port: 5173
  },
  preview: {
    port: 5173
  }
  // server: {
  //   port: 3000
  //   // allowedHosts:['5278831-ad07030.twc1.net']
  // }
  // server: {
  //   // Exposes your dev server and makes it accessible for the devices in the same network.
  //   host: true,
  //   port: 10004
  // }
})
