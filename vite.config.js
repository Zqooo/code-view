import { createVuePlugin } from 'vite-plugin-vue2'
export default {
  resolve:{
    extensions:[".vue",".js"]
  },
  plugins: [createVuePlugin()]
}