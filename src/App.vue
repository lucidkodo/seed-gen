<template lang="pug">
//- img(alt="Vue logo", src="./assets/logo.png")
//- HelloWorld(msg="Seed generator")
h1 Seed generator
div
  p today: {{ today }}
  p 2 random numbers: {{ string }}
  button(@click="increment") +
  p my num: {{ num }}
  p city: {{ city }}
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import dayjs from 'dayjs'
import ranGen from 'randomatic'
import geo from '../data/geo/cities.json'
import female from '../data/names/female.json'
import male from '../data/names/male.json'
import lastname from '../data/names/lastname.json'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },

  async created () {
    console.log('created')
  },

  async mounted () {
    console.log('mounted')
    console.log(
      female[this.randomInRange(female.length)].name +
      ' and ' +
      male[this.randomInRange(male.length)].name +
      ' ' +
      lastname[this.randomInRange(lastname.length)].name +
      ' from ' +
      geo[this.randomInRange(geo.length)].name
    )
  },

  data () {
    return {
      today: dayjs().format('YYYY-MM-DD'),
      string: ranGen('0') + ', ' + ranGen('0'),
      result: '',
      num: 0,
      dataPool: [],
      city: geo[14442].name,

      randomInRange () {
        function getRand (num) {
          return Math.floor(Math.random() * num)
        }

        let result

        if (arguments.length === 2) {
          const min = Math.min(...arguments)
          const max = Math.max(...arguments)
          const range = []

          for (var i = min; i < max + 1; i++) {
            range.push(i)
          }
          const rangeIndex = getRand(range.length)
          result = range[rangeIndex]
        } else if (arguments.length === 1) {
          result = getRand(arguments[0])
        }

        return result
      },

      doSomething (e) {
        console.log(e)
        this.result = e
      },

      increment () {
        this.num++
      }
    }
  }
}
</script>

<style lang="sass">
@import app
</style>
