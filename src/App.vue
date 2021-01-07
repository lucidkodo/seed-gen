<template lang="pug">
#component
  //- h1 Seed gen
  .header(v-for="(header, index) in headers", :i="index", :header="header")
    button.remove-header(@click="headers.splice(index, 1)") Remove header
    p.title Header:
    input(type="text", placeholder="Header name", v-model="header.name")
    br

    p.title Pool:
    input(type="radio", :id="'pool' + index", :value="true", v-model="header.pool")
    label(:for="'pool' + index") existing
    input(type="radio", :id="'custom' + index", :value="false", v-model="header.pool")
    label(:for="'custom' + index") custom

    .pool(v-if="header.pool")
      input(type="radio", :id="'female' + index", value="female", v-model="header.poolName")
      label(:for="'female' + index") Female firstnames
      br

      input(type="radio", :id="'male' + index", value="male", v-model="header.poolName")
      label(:for="'male' + index") Male firstnames
      br

      input(type="radio", :id="'lastname' + index", value="lastname", v-model="header.poolName")
      label(:for="'lastname' + index") Lastnames
      br

      input(type="radio", :id="'geo' + index", value="geo", v-model="header.poolName")
      label(:for="'geo' + index") City names

    .custom-pool(v-if="header.pool === false")
      p.title Components:
      br

      .part-list(v-if="header.parts")
        div(v-for="(opts, optIndex) in header.parts")
          p.selected-parts(v-if="opts.name === 'range' || opts.name === 'char'") {{ opts.name }}: {{ opts.value }}
          p.selected-parts(v-else) {{ opts.name }}
          button(@click="header.parts.splice(optIndex, 1)") -

      .components
        p Random
        br
        .parts
          .container
            label Digit
            button(@click="header.parts.push({name: 'digit', handler: 'random', value: '0'})") +
          i.tips 0123456789

          .container
            label Alphabet Lowercase
            button(@click="header.parts.push({name: 'alpha', handler: 'random', value: 'a'})") +
          i.tips abcdefghijklmnopqrstuvwxyz

          .container
            label Alphabet Uppercase
            button(@click="header.parts.push({name: 'ALPHA', handler: 'random', value: 'A'})") +
          i.tips ABCDEFGHIJKLMNOPQRSTUVWXYZ

          .container
            label Symbols
            button(@click="header.parts.push({name: 'symb', handler: 'random', value: '!'})") +
          i.tips ~!@#$%^&()_+-={}[];\',.

          .container
            label Range
            br
            input(type="number", :id="'min' + index", placeholder="start")
            input(type="number", :id="'max' + index", placeholder="end")
            button(@click="header.parts.push({name: 'range', handler: 'range', value: getValue('range', index)})") +
          i.tips number range

          .container
            label Characters
            br
            input(type="text", :id="'char' + index", placeholder="chars")
            button(@click="header.parts.push({name: 'char', handler: 'plain', value: getValue('char', index)})") +
          i.tips Will be inserted as per

  button(@click="addHeader") Add New Header
  br
  br
  button(@click="processData") Process

#results
  //- h1 Results
  label.title Number of rows:
  br
  input(type="number", v-model="rows")
  br

  textarea(v-model="csvResults")
  br
  button(@click="downloadCsv") Download CSV
</template>

<script>
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
    console.log(this.randomInRange(3, 5))
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
          parts: [
            {
              name: 'digit',
              handler: 'random',
              value: '0'
            }
          ],
          finalValue: ''
        }
      ],
      rows: 1000,
      csvResults: 'line1\nline2',
      resultArr: [],

      addHeader () {
        this.headers.push({
          name: '',
          pool: '',
          poolName: '',
          parts: [],
          finalValue: ''
        })
      },

      getValue (type, i) {
        let value = ''

        if (type === 'range') {
          value = [parseInt(window['min' + i].value || 0), parseInt(window['max' + i].value || 0)]
        } else if (type === 'char') {
          value = window['char' + i].value.trim() || ''
        }
        return value
      },

      getName () {

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

      processData () {
        const obj = {}

        for (let i = 0; i < this.headers.length; i++) {
          const header = this.headers[i]
          obj[header.name] = ''

          if (header.pool) {
            switch (header.poolName) {
              case 'geo':
                obj[header.name] = geo[this.randomInRange(geo.length)].name
                break
              case 'female':
                obj[header.name] = female[this.randomInRange(female.length)].name
                break
              case 'male':
                obj[header.name] = male[this.randomInRange(male.length)].name
                break
              case 'lastname':
                obj[header.name] = lastname[this.randomInRange(lastname.length)].name
                break
            }
          } else {
            for (let i = 0; i < header.parts.length; i++) {
              const part = header.parts[i]

              if (part.handler === 'random') {
                obj[header.name] += ranGen(part.value)
              } else if (part.handler === 'range') {
                obj[header.name] += this.randomInRange(part.value[0], part.value[1])
              } else if (part.handler === 'plain') {
                obj[header.name] += part.value
              }
            }
          }
        }
        console.log(obj)
      },

      processHeader (headerObj) {
        for (let i = 0; i < headerObj.parts.length; i++) {
          const opt = headerObj.parts[i]

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
