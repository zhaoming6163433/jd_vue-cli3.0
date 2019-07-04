import Vue from 'vue'
import Router from 'vue-router'
const Home = r => require.ensure([], () => r(require('@/views/Home')), 'chunkname1')
const Proexim = r => require.ensure([], () => r(require('@/views/proexim/index')), 'chunkname2')

Vue.use(Router)

export default new Router({
    //   mode: 'history',
    //   base: process.env.BASE_URL,
    routes: [{
        path: '/',
        name: 'home',
        component: Home,
        children: [
            { //项目准入审批
                path: '/proexim',
                name: 'proexim',
                component: Proexim
            }
        ]
    }]
})