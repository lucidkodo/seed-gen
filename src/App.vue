<template lang="pug">
#component
  //- h1 Seed gen
  .header(v-for="(header, index) in headers", :i="index", :header="header")
    p.title Header:
    input(type="text", placeholder="Header name", v-model="header.name")
    br
    p.title Pool:
    input(type="radio", :id="'existing' + index", :value="true", v-model="header.existing")
    label(:for="'existing' + index") existing

    input(type="radio", :id="'notExisting' + index", :value="false", v-model="header.existing")
    label(:for="'notExisting' + index") custom

    .pool(v-if="header.existing")
      input(type="radio", :id="'female' + index", value="female", v-model="header.pool")
      label(:for="'female' + index") Female first names
      input(type="radio", :id="'male' + index", value="male", v-model="header.pool")
      label(:for="'male' + index") Male first names
      input(type="radio", :id="'lastname' + index", value="lastname", v-model="header.pool")
      label(:for="'lastname' + index") Lastnames
      input(type="radio", :id="'geo' + index", value="geo", v-model="header.pool")
      label(:for="'geo' + index") City names
    hr

  button(@click="addHeader") Add Header

#results
  //- h1 Results
  textarea(v-model="csvResults")
  br
  button(@click="downloadCsv") Download CSV
</template>

<script>
import ranGen from 'randomatic'
// import geo from '../data/geo/cities.json'
// import female from '../data/names/female.json'
// import male from '../data/names/male.json'
// import lastname from '../data/names/lastname.json'

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
    // console.log(
    //   female[this.randomInRange(female.length)].name +
    //   ' and ' +
    //   male[this.randomInRange(male.length)].name +
    //   ' ' +
    //   lastname[this.randomInRange(lastname.length)].name +
    //   ' from ' +
    //   geo[this.randomInRange(geo.length)].name
    // )
  },

  data () {
    return {
      headers: [
        {
          name: 'Cities',
          existing: true,
          pool: 'female'
        }
      ],
      csvResults: 'line1\nline2',

      addHeader () {
        this.headers.push({
          name: '',
          existing: true,
          pool: ''
        })
      },

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

      downloadCsv () {
        this.headers.map(h => {
          console.log(h)
        })
        console.log(this.handler(this.regular, 'regular string'))
      },

      random (param) {
        return ranGen(param)
      },

      regular (param) {
        return param
      },

      handler (type, value) {
        return type(value)
      }
    }
  }
}
</script>

<style lang="sass">
@import app
</style>
