<template>
  <div class="cfmenu">
      <el-menu
      :default-active="activeNames"
      class="el-menu-vertical"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu :index="item.id+''" :key="index" v-for="(item,index) in menulist">
        <template slot="title">
          <i :class="item.code"></i>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item-group>
            <el-menu-item @click="menuili($event,itemin)" :index="itemin.code+''"  :key="index" v-for="(itemin,index) in item.children">
                <span>{{itemin.name}}</span>
            </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import router from '../router'
import appConfigs from '@/configs'
import util from '@/util/util.js'
import { mapMutations, mapState } from 'vuex'
import { post_get_menu_list } from '@/model/api.js'

export default {
    name: 'cfmenu',
    props: [],
    components: {
        
    },
    data() {
        return {
            activeNames: '',
            selarr:['proexim'],
            menulist: [{
            "id": 7266,
            "name": "项目管理",
            "code": "el-icon-menu",
            "url": "",
            "parentId": 6876,
            "level": 2,
            "seq": 4,
            "children": [{
                "id": 7832,
                "name": "测试菜单",
                "code": "proexim",
                "url": "",
                "parentId": 7266,
                "level": 3,
                "seq": 0,
                "children": [],
                "type": 0
            }],
            "type": 0
        }]
        }
    },
    computed: {
        ...mapState([
            'userinfo'
        ]),
    },
    methods: {
        async post_menu_list() {
            try {
                let res = await post_get_menu_list();
                let _arr = [];//最终处理后的数组
                let otherarr = [];//其它菜单
                //处理其它菜单合并到当前数组中
                if(res.length>1){
                    res.forEach((item,index) => {
                        if(index>0){
                            otherarr = otherarr.concat(item.children);
                        }
                    });
                }
                res[0].children = res[0].children.concat(otherarr);

                res[0].children.forEach(item => {
                    //供应商管理和项目管理公用一个图标 并且本项目只展示供应商管理菜单
                    if(item.code.indexOf("el-icon-menu1")!=-1){
                        item.code = "el-icon-menu";
                        _arr.push(item);
                    }
                });
                this.menulist = _arr;
            } catch (e) {

            }
        },
        ...mapMutations({

        }),
        handleOpen(key, keyPath) {
            //console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            //console.log(key, keyPath);
        },
        //点击菜单
        menuili(e, item) {
            this.$router.push({ 'name': item.code });
        },
        //根据地址展示按钮选择
        selectmenu() {
            let url = window.location.href;
            let name = '';
            if (url.substring(url.indexOf('#/')).indexOf('?') != -1) {
                name = url.substring(url.indexOf('#/'), url.indexOf('?'));
            } else {
                name = url.substring(url.indexOf('#/'));
            }
            let _arr = name.split('#/');
            name = _arr[1];
            if (name) {
                //展示按钮点击样式
                this.updatebtn(name);
            }else{
                this.selarr.forEach((item)=>{
                    if(url.indexOf(item)!=-1){
                        name = item;
                        this.updatebtn(name);
                    }
                })
            }
        },
        //修改按钮颜色
        updatebtn(name) {
            this.activeNames = name;
        }
    },
    watch:{
        
    },
    created() {

    },
    created() {
        router.beforeEach((to, from, next) => {
            let name = to.path.split('/')[2];
            next();
            if (name) {
                this.updatebtn(name);
            }
        });
    },
    mounted() {
        this.selectmenu();
    }
}
</script>
<!--修改组件样式-->
<style lang="scss" scoped>
.cfmenu {
    position: absolute;
    z-index: 1;
    width: 200px;
    bottom: 0;
    top: 50px;
    overflow: hidden;
    background: $menuback;
    border-right: 1px solid rgba(255, 255, 255, 0.15);
    .el-badge__content.is-fixed{
        top:10px;
    }
    .el-menu-vertical {
        width: 200px;
        position: absolute;
    }
    .svgimg {
        position: absolute;
        bottom: 10px;
    }
}
</style>
