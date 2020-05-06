<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentUrl: '',
      ticket: '',
      userInfo: '',
      token: '',
    }
  },
  async created () {
    
  },
  methods: {
    
  }
}
</script>

<style lang="scss">
html,body{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  box-sizing: border-box;
  // tab-var固定在顶部
  padding-top: 46px;
}
</style>
