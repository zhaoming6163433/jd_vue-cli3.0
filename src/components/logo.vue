<template>
    <div>
        <div class="toplogo" @mouseenter="enter" @mouseleave="leave">
            <div class="logo">
                <div :class="`logotext animated  ${animatelogo}`">{{logoname}}</div>
            </div>
            <!-- <div class="backbtn" @click="goback"><i class="el-icon-back"></i></div> -->
            <div class="userinfo">
                <img src="@assets/images/icon_yonghu1.png"/>
                <span>{{info.nick}}</span>
                <div :class="`animated marq ${marqm}`">{{info.orgName}}</div>
                <img class="logout" @click="logout" src="@assets/images/icon_guanbi.png"/>
            </div>
        </div>
        <div class="logoback"><img src="@assets/images/logoback.png"/></div>
    </div>
</template>

<script>
    import util from '@/util/util.js'
    import appConfigs from '@/configs'
    import { get_user_info, post_save_user_info } from '@/model/api.js'
    import { setInterval, setTimeout } from 'timers';
    import { mapMutations,mapState } from 'vuex'

    export default {
        name: 'toplogo',
        props: [],
        data() {
            return {
                logoname: appConfigs.pagename.logoname,
                marqm:"",//机构动画
                animatelogo:"",//logo动画
                info:{}//用户信息
            }
        },
        watch:{

        },
        computed: {
            ...mapState([

            ]),
        },
        methods: {
            ...mapMutations({
                SAVE_USER_INFO: 'SAVE_USER_INFO'//储存用户信息
            }),
            //记录用户信息
            async save_user_info(){
                try{
                    let res = await post_save_user_info();
                }catch(e){

                }
            },
            //用户信息
            async user_info(params){
                try{
                    let res = await get_user_info(params);
                    this.info = res.datas;
                    this.SAVE_USER_INFO(this.info);
                }catch(e){

                }
            },
            //鼠标离开
            leave(){
                this.animatelogo = "";
                this.marqm = "";
            },
            //鼠标进入
            enter(){
                this.animatelogo = "rubberBand";
                this.marqm = "flash";
            },
            //退出登录，只能在测试环境和线上环境return域名前后相同情况下生效
            logout(){
                if(process.env.srconfig == 'dev'){
                    window.open(appConfigs.loginurl+'/logout?ReturnUrl='+appConfigs.urlWebHttp+'/mdsexternal','_top');
                }else{
                    window.open(appConfigs.loginurl+'/logout?ReturnUrl='+appConfigs.urlWebHttp+'/cfm/mdsexternal','_top');
                }
            }
        },
        mounted() {
            this.save_user_info();
            this.user_info();
        }
    }
</script>

<style lang="scss" scoped>
    .toplogo {
        height: 50px;
        width: 100%;
        min-width: 1100px;
        z-index: 2;
        position: absolute;
        background: rgba(28,35,39,0.6);
        border-bottom: 1px solid rgba(255, 255, 255, 0);
        .myrefresh{
            color:#ffffff;
            margin-right:20px;
            cursor: pointer;
        }
        .logotext{
            width:300px;
            color:$wihte_c;
            letter-spacing: 10px;
            margin-top:10px;
            margin-left:20px;
            font-size:20px;
            font-weight: bold;
            cursor: pointer;
        }
        .backbtn{
            width:20px;
            left: 220px;
            position: absolute;
            top: 14px;
            right:10px;
            cursor: pointer;
            color: #ffffff;
        }
        .userinfo{
            display: flex;
            align-items:center;/*垂直居中*/
            position: absolute;
            right: 20px;
            top: 15px;
            .info{
                animation-duration:4s;
                animation-iteration-count: infinite;
                cursor: pointer;
                margin-right:40px;
            }
            span{
                color: #ffffff;
            }
            img{
                width:25px;
            }
            .marq{
                display: flex;
                align-items:right;
                color: #ffffff;
                margin-left:20px;
            }
        }
        .logout{
            cursor: pointer;
            margin-left: 20px;
        }
    }
    .toplogo:hover{
        background: rgb(28,35,39);
    }
    .logoback{
        height:50px;
        min-width: 1100px;
        text-align: center;
        background-color:#181C20;
       img{
           width:auto;
           height:100%;
       }
    }
</style>
