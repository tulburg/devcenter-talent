<template>
    <div id="app">
        <Header />
        <router-view/>
    </div>
</template>

<script>
    import Header from '@/components/Header' 
    export default {
        name: 'App',
        components : { Header }
    }
</script>



<style type="text/css" src="./assets/fonts/circular/stylesheet.css"></style>
<style type="text/css" src="./assets/fonts/dc/dc.css"></style>
<style type="text/css" src="./assets/css/main.css"></style>

