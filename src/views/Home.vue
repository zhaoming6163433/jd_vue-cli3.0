<template>
  <div class="home">
        <div class="content">
            <router-view class="child-view"></router-view>
        </div>
        <mdslogo></mdslogo>
        <cfmenu></cfmenu>
  </div>
</template>

<script>
import cfmenu from '@/components/cfmenu'//菜单
import mdslogo from '@/components/logo'//logo
import { post_test_info } from 'api/api.js'

export default {
    name: 'home',
    components: {
        cfmenu,
        mdslogo
    },
    methods: {
        async test_info(params) {
            try {
                let res = await post_test_info(params);
                console.log(res)
            } catch (e) {

            }
        }
    },
    mounted() {
        this.test_info({});
    }
}
</script>
<style lang="scss" scoped>
    .child-view {
         @include font(0.8rem, 0.8rem);
    }
    .content {
        overflow-x: auto;
        background: rgba(255, 255, 255, 0);
        position: absolute;
        top: 51px;
        right: 0;
        bottom: 0;
        left: 200px;
        z-index: 1;
        min-width: 900px;
        margin: 0;
        padding: 0;
        background-color: #f5f6fa;
    }
</style>