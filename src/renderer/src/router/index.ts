import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const LocalRoutes: RouteRecordRaw[] = []

const modules: Record<string, { default: RouteRecordRaw }> = import.meta.glob('./modules/*.ts', {
    eager: true
})
Object.keys(modules).forEach((key) => {
    const module = modules[key]?.default
    if (!module) return
    LocalRoutes.push(...(Array.isArray(module) ? [...module] : [module]))
})

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'root',
        redirect: { name: 'home' },
        children: [...LocalRoutes]
    },
    {
        path: '/:catchAll(.*)',
        name: '404',
        component: () => import('@renderer/view/failed/404.vue'),
        meta: {
            title: '页面不存在',
            icon: ''
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {}
})

export default router
