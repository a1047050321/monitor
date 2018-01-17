// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueVideoPlayer from 'vue-video-player'
import Util from '@/assets/js/util'
import bus from '@/assets/js/bus'
import App from './App'
import md5 from "js-md5"
import router from './router'
import utilTools from './router/utilTools'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-contrib-hls/dist/videojs-contrib-hls.js'
import 'video.js/dist/lang/zh-CN.js'
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/main'
import $ from 'jquery'
import store from "@/assets/js/store"
import Vuex from 'vuex';
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(Util);
Vue.use(utilTools);

Vue.use(VueVideoPlayer);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    console.log(to);
    if (from.name == "HandlePending") {
        bus.$emit("out", true);
    }
    next()
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App,
    }
})