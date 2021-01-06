<template lang="pug">
#component
  //- h1 Seed gen
  .header(v-for="(header, index) in headers", :i="index", :header="header")
    button.remove-header(@click="removeHeader(index)") Remove header
    p.title Header:
    input(type="text", placeholder="Header name", v-model="header.name")
    br
    p.title Pool:
    input(type="radio", :id="'pool' + index", :value="true", v-model="header.pool")
    label(:for="'pool' + index") existing

    input(type="radio", :id="'custom' + index", :value="false", v-model="header.pool")
    label(:for="'custom' + index") custom

    .pool(v-if="header.pool")
      input(type="radio", :id="'female' + index", value="female", v-model="header.pool")
      label(:for="'female' + index") Female firstnames
      input(type="radio", :id="'male' + index", value="male", v-model="header.pool")
      label(:for="'male' + index") Male firstnames
      input(type="radio", :id="'lastname' + index", value="lastname", v-model="header.pool")
      label(:for="'lastname' + index") Lastnames
      input(type="radio", :id="'geo' + index", value="geo", v-model="header.pool")
      label(:for="'geo' + index") City names

    .custom-pool(v-if="header.pool === false")
      p.title Components:
      br
      .part-list(v-if="header.parts.collection")
        div(v-for="(opts, optIndex) in header.parts.collection")
          p.selected-parts {{ opts.name }}
          button(@click="header.parts.collection.splice(optIndex, 1)") -
      .components
        input(type="radio", :id="'static' + index", :value="true", v-model="header.parts.isStatic")
        p Static
        br
        textarea(v-model="header.parts.value")

      .components
        input(type="radio", :id="'dynamic' + index", :value="false", v-model="header.parts.isStatic")
        p Dynamic
        br
        .parts
          .container
            label Digit
            button(@click="header.parts.collection.push({name: 'digit', handler: 'random', value: '0'})") +
          .container
            label Alphabet Lowercase
            button(@click="header.parts.collection.push({name: 'alphabet', handler: 'random', value: 'a'})") +
          .container
            label Alphabet Uppercase
            button(@click="header.parts.collection.push({name: 'ALPHABET', handler: 'random', value: 'A'})") +
          .container
            label Symbols
            button(@click="header.parts.collection.push({name: 'symbols', handler: 'random', value: '!'})") +
          .container
            label Range
            br
            input(type="number", :id="'min' + index", placeholder="start")
            input(type="number", :id="'max' + index", placeholder="end")
            button(@click="header.parts.collection.push({handler: 'range', value: getValue('range', index)})") +
          .container
            label Fixed Characters
            input(type="text", :id="'fixChar' + index", placeholder="chars")
            button(@click="header.parts.collection.push({handler: 'plain', value: getValue('char', index)})") +
    hr

  button(@click="addHeader") Add New Header

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
          pool: false,
          poolName: 'female',
          parts: {
            isStatic: false,
            collection: [
              {
                name: 'digit',
                handler: 'random',
                value: '0'
              }
            ]
          },
          finalValue: ''
        }
      ],
      csvResults: 'line1\nline2',

      removeHeader (i) {
        this.headers.splice(i, 1)
      },

      addHeader () {
        this.headers.push({
          name: '',
          existing: true,
          pool: ''
        })
      },

      getValue (type, i) {
        let value = ''

        if (type === 'range') {
          value = [parseInt(window['min' + i].value), parseInt(window['max' + i].value)]
        } else if (type === 'char') {
          value = window['fixChar' + i].value.trim()
        }
        return value
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

          for (let i = min; i < max + 1; i++) {
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
      },

      processHeader (headerObj) {
        for (let i = 0; i < headerObj.parts.collection.length; i++) {
          const opt = headerObj.parts.collection[i]

          if (opt.handler === 'random') {
            ranGen(opt.value)
          } else if (opt.handler === 'range') {
            this.randomInRange(opt.value)
          } else if (opt.handler === '') {
            // code here
          }
        }
      }
    }
  }
}
</script>

<style lang="sass">
@import app
</style>
