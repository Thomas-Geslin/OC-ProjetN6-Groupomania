<template>
  <LoginPage />
  <!--<SocialNetwork />-->
</template>

<script>
import LoginPage from './components/LoginPage.vue'
//import SocialNetwork from './components/SocialNetwork.vue'

export default {
  name: 'App',
  components: {
    LoginPage,
//    SocialNetwork
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Open Sans', sans-serif;
  text-align: center;
  margin-top: 60px;
}
</style>
