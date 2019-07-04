<template>
    <div class="proexim">
        <protitle title="项目管理 / 测试菜单"></protitle>
    </div>
</template>

<script>
    import util from '@/util/util.js'
    import appConfigs from '@/configs'
    import seloption from '@/util/seloption.json'
    import protitle from '@/components/protitle'
    import { mapMutations,mapState } from 'vuex'

    export default {
        name: 'proexim',
        props: [],
        data() {
            return {
               activeName: 'second' 
            }
        },
        components: {
            protitle
        },
        watch:{

        },
        computed: {
            ...mapState([

            ]),
        },
        methods: {
            handleClick(){

            }
        },
        mounted() {
            
        }
    }
</script>

<style lang="scss" scoped>
    .proexim {
        
    }
</style>
