<template>
    <div>
        <iframe :src="src" frameborder="0" style="width: 100vw; height: 100vh"></iframe>
    </div>
</template>

<script>
    export default {
        name: "iframe",
        data(){
            return{
                src: this.$api.baseUrl + "/druid"
            }
        }
    }
</script>

<style scoped>

</style>