import type { RouteRecordRaw } from 'vue-router'
// @unocss-include

export default <RouteRecordRaw>{
    path: 'home',
    name: 'home',
    component: () => import('@renderer/view/home/index.vue'),
    meta: {
        title: '首页'
    }
}
