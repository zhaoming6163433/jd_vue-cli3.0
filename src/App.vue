<template>
    <div id="app">
        <transition name="router-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import router from './router'
import util from './util/util.js'

export default {
    name: 'app',
    data() {
        return {
            titlename: {
                "proexim":"测试菜单",
            }
        }
    },
    created() {
        //缓存this
        util.vuethis = this;
        //拦截路由
        router.beforeEach((to, from, next) => {
            next();
            this.firstitle();
        });
        //首次进入页面设置标题
        this.firstitle();
    },
    methods: {
        //第一次进入页面也判断标题
        firstitle() {
            let url = window.location.href;
            let name = '';
            if (url.indexOf('?') != -1) {
                name = url.substring(url.indexOf('#') + 2, url.indexOf('?'));
            } else {
                name = url.substring(url.indexOf('#') + 2);
            }
            let _arr = name.split('/');
            name = _arr[_arr.length - 1];
            if (name) {
                document.title = this.titlename[name]
            }else{
                document.title = "项目名称";
            }
        }
    },
    components: {

    }
}
</script>

<style lang="scss" >
    @import "assets/css/myelementui.scss";
    @import "assets/css/common.scss";
</style>
