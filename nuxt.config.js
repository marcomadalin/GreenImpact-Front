export default {
  env: {
    baseUrl: process.env.API_BASE_URL,
    assetsUrl: process.env.ASSETS_URL,
  },
  telemetry: false,
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'es',
      translate: 'no',
    },
    titleTemplate: '%s - Back2blu',
    title: 'Back2blu',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/logo.png' },
      /*
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap',
      },
      */
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/custom.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/roles-mixin.js', mode: 'client' },
    { src: '~/plugins/products-mixin.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Inter: [400, 600, 700],
          Lexend: [400, 500, 700],
        },
        display: 'swap',
        prefetch: false,
        preconnect: false,
        preload: false,
        download: true,
        base64: false,
        overwriting: false,
      },
    ],
    '@nuxtjs/composition-api/module',
  ],
  eslint: {
    cache: false,
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', '@nuxtjs/i18n'],

  i18n: {
    locales: [
      {
        name: 'spanish',
        code: 'es',
        iso: 'es-ES',
        file: 'es-ES.js',
      },
      {
        name: 'english',
        code: 'en',
        iso: 'en-EN',
        file: 'en-EN.js',
      },
      {
        name: 'catalan',
        code: 'ca',
        iso: 'ca-ES',
        file: 'ca-ES.js',
      },
    ],
    lazy: true,
    seo: true,
    langDir: '~/lang/',
    defaultLocale: 'es',
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'es',
      formatFallbackMessages: true,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      onlyOnRoot: true, // recommended
    },
  },

  axios: {
    baseURL: 'http://localhost:8000',
    // debug: process.env.NODE_ENV !== 'production',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    optionsPath: './vuetify.options.js',
    customVariables: ['~/assets/variables.scss'],
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/',
    },

    strategies: {
      local: {
        token: {
          property: 'accessToken',
          global: true,
          required: true,
          type: 'Bearer',
        },
        user: {
          property: false,
        },
        endpoints: {
          login: { url: '/user/authentication/login', method: 'post' },
          logout: { url: '/user/authentication/logout', method: 'post' },
          user: { url: '/user/authentication/whoami', method: 'get' },
        },
      },
    },
  },

  router: {
    middleware: ['auth', 'language'],

    extendRoutes(routes, resolve) {
      routes.push({
        name: 'license-add',
        path: '/entity/:uuid/license/add',
        component: resolve(__dirname, 'pages/entity/license/add.vue'),
      })
      routes.push({
        name: 'entity-license',
        path: '/entity/:uuid/license',
        component: resolve(__dirname, 'pages/entity/license/list.vue'),
      })
      routes.push({
        name: 'entity-profile',
        path: '/entity/:id',
        component: resolve(__dirname, 'pages/entity/profile.vue'),
      })
      routes.push({
        name: 'entity-add',
        path: '/entity/add',
        component: resolve(__dirname, 'pages/entity/add.vue'),
      })
      routes.push({
        name: 'entity-list',
        path: '/entity',
        component: resolve(__dirname, 'pages/entity/list.vue'),
      })
      routes.push({
        name: 'indicator-list',
        path: '/indicators',
        component: resolve(__dirname, 'pages/indicator/list.vue'),
      })
      routes.push({
        name: 'user-settings',
        path: '/user/:user/settings',
        component: resolve(__dirname, 'pages/userSettings.vue'),
      })
      routes.push({
        name: 'signup',
        path: '/signup/',
        component: resolve(__dirname, 'pages/signup.vue'),
        auth: false,
      })
      routes.push({
        name: 'user-add',
        path: '/user/add',
        component: resolve(__dirname, 'pages/user/add.vue'),
      })
      routes.push({
        name: 'user-list',
        path: '/user',
        component: resolve(__dirname, 'pages/user/list.vue'),
      })
      routes.push({
        name: 'plan-add',
        path: '/plan/add',
        component: resolve(__dirname, 'pages/plan/add.vue'),
      })
      routes.push({
        name: 'plan-update',
        path: '/plan/:id/update',
        component: resolve(__dirname, 'pages/plan/add.vue'),
      })
      routes.push({
        name: 'area-list',
        path: '/plan/:plan/area/list',
        component: resolve(__dirname, 'pages/plan/area/list.vue'),
      })
      routes.push({
        name: 'area-viewlist',
        path: '/plan/:plan/area/viewlist',
        component: resolve(__dirname, 'pages/plan/area/viewlist.vue'),
      })
      routes.push({
        name: 'area-add',
        path: '/plan/:plan/area/add',
        component: resolve(__dirname, 'pages/plan/area/add.vue'),
      })
      routes.push({
        name: 'area-update',
        path: '/plan/:plan/area/:id/update',
        component: resolve(__dirname, 'pages/plan/area/add.vue'),
      })
      routes.push({
        name: 'area-indicators-add',
        path: '/plan/:plan/area/:id/indicators',
        component: resolve(__dirname, 'pages/plan/area/indicators.vue'),
      })
      routes.push({
        name: 'area-samples-add',
        path: '/plan/:plan/area/:area/indicators/:indicator/samples',
        component: resolve(__dirname, 'pages/plan/area/samples.vue'),
      })
      routes.push({
        name: 'area-samples-update',
        path: '/plan/:plan/area/:area/indicators/:indicator/samples/:id/update',
        component: resolve(__dirname, 'pages/plan/area/samples.vue'),
      })
      routes.push({
        name: 'area-objectives-add',
        path: '/plan/:plan/area/:area/indicators/:indicator/objectives',
        component: resolve(__dirname, 'pages/plan/area/objectives.vue'),
      })
      routes.push({
        name: 'area-objectives-update',
        path: '/plan/:plan/area/:area/indicators/:indicator/objectives/:objective',
        component: resolve(__dirname, 'pages/plan/area/objectives.vue'),
      })
      routes.push({
        name: 'error-404',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue'),
      })
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['auth-next'],
  },
  /*
  loading: {
    color: 'white',
    height: '3px',
  },
  */
  generate: {
    exclude: [/^\/_pages/, /^\/_components/],
  },
}
