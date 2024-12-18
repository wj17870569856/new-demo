// import getRoutes from './router';

const path = require("path");
export default {
  hooks: {
    "render:route": (url, result) => {
      result.html = result.html.replace(/ data-n-head=\"ssr\"/gi, "");
    },
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "赣州市数据要素共享服务中心",
    script: [
      {type:'text/javascript',src:"https://api.de.guanyingis.com/static/js/client.js"},
      {type:'text/javascript',src:"https://webapi.amap.com/maps?v=2.0&key=c3ba98578ec548598d8601529ed2ee5e&plugin=AMap.AutoComplete"},
      {type:'text/javascript',src:"https://webapi.amap.com/loca?v=2.0&key=c3ba98578ec548598d8601529ed2ee5e&plugin=AMap.AutoComplete"},
    ],
    htmlAttrs: {
      lang: "zh",
    },
    meta: [
      {
        charset: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "format-detection",
        content: "telephone=no",
      },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["assets/css/base.css", "element-ui/lib/theme-chalk/index.css"],

  plugins: [
    {
      src: "@/plugins/element-ui",
      ssr: true,
    },
    {
      src: "@/plugins/icons",
      ssr: true,
    },
    {
      src: "@/plugins/js-cookie",
      ssr: true,
    },
    {
      src: "@/plugins/swiper",
      ssr: false,
    },
    {
      src: "@/plugins/seamlessScroll",
      ssr: false,
    },
    {
      src: "@/plugins/request",
      ssr: false,
    },
    {
      src: "@/plugins/china-area-data",
      ssr: false,
    },
    {
      src: "@/plugins/message",
      ssr: true,
    },
    {
      src: "@/plugins/xlsx",
      ssr: false,
    },
    {
      src: "@/plugins/moment",
      ssr: true,
    },
  ],

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: "*",
        redirect: "/",
      });
    },
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxt/postcss8",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    'vue2-editor/nuxt'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    proxy: true,
    baseURL: "/",
  },
  proxy: {
    "/apinew": "https://api.de.guanyingis.com/api",
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    productionSourceMap: false,
    extend(config, ctx) {
      const svgRule = config.module.rules.find((rule) =>
        rule.test.test(".svg")
      );
      svgRule.exclude = [path.resolve(__dirname, "assets/icon")];
      // Includes /icons/svg for svg-sprite-loader
      config.module.rules.push({
        test: /\.svg$/,
        include: [path.resolve(__dirname, "assets/icon")],
        loader: "svg-sprite-loader",
        options: {
          symbolId: "icon-[name]",
        },
      });
    },
  },
};
