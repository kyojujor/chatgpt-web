import { createApp } from 'vue'
import type { LogtoConfig } from '@logto/vue'
import { createLogto } from '@logto/vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'

const config: LogtoConfig = {
  endpoint: 'https://aaotei.logto.app/',
  appId: 't4C5kRWWkqqS69IgfcgcB',
}
async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)

  app.use(createLogto, config)

  app.mount('#app')
}

bootstrap()
