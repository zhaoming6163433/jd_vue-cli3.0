<template>
    <div class="protitle">
        {{title}}
    </div>
</template>

<script>
export default {
    name: 'protitle',
    props: ["title"],
    data() {
        return {

        }
    },
    watch: {

    },
    computed: {

    },
    methods: {

    },
    mounted() {

    }
}
</script>

<style lang="scss" scoped>
.protitle {
    width: 100%;
    height: 40px;
    background-color: #fff;
    border-bottom: 3px solid #f5f6fa;
    line-height:40px;
    padding-left:20px;
    color:$gray;
    box-sizing: border-box;
}
</style>
