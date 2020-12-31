<template lang="pug">
img(alt="Vue logo" src="./assets/logo.png")
HelloWorld(msg="Seed generator")
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },

  data () {
    return {
      target: '',

      randomize () {
        console.log('Let\'s go!')
      }
    }
  },

  mounted () {
    // load data
    this.randomize()
  }

}
</script>

<style lang="sass">
@import app
</style>
