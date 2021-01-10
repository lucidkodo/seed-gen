<template lang="pug">
#builder
  //- h1 Seed gen
  .header-box(v-for="(header, index) in headers", :id="index")
    button.remove-header(@click="headers.splice(index, 1)") &times;

    .header-info(@click="showHeader(index)")
      p.title Header Name:
      input(type="text", placeholder="Header name", v-model="header.name")
      p.title Data Structure:
      span {{ header.parts.length }} part(s) selected

    .components(:id="'edit' + index")
      .part-list(v-if="header.parts.length")
        div(v-for="(opts, optIndex) in header.parts")
          p.selected-parts(v-if="opts.handler === 'default'") {{ opts.value }}
          p.selected-parts(v-if="opts.name === 'range' || opts.name === 'char'") {{ opts.name }}: {{ opts.value }}
          p.selected-parts(v-if="opts.name === 'custom'") pool of {{ opts.value.length }}
          p.selected-parts(v-if="opts.name === 'digit' || opts.name === 'alpha' || opts.name === 'ALPHA' || opts.name === 'symb'") {{ opts.name }}
          button.remove-part(@click="header.parts.splice(optIndex, 1)") -
      .part-list(v-else)
        i Select items from the following to build

      //- .tips
        //- i(:class="{showTip: hovered()}")
        i {{ tip }}

      .parts
        b.component-title Pre-generated pools
        .component-group
          .component-type(@mouseover="displayTip('female')", @click="displayTip('female')")
            label female names
            button(@click="header.parts.push({name: 'female', handler: 'default', value: 'firstname (f)'})") +
          //- i.tips female names

          .component-type(@mouseover="displayTip('male')", @click="displayTip('male')")
            label male names
            button(@click="header.parts.push({name: 'male', handler: 'default', value: 'firstname (m)'})") +
          //- i.tips male names

          .component-type
            label lastnames
            button(@click="header.parts.push({name: 'lastname', handler: 'default', value: 'lastnames'})") +
          //- i.tips lastnames

          .component-type
            label city names
            button(@click="header.parts.push({name: 'geo', handler: 'default', value: 'city names'})") +
          //- i.tips city names

        b.component-title Random Single Character
        .component-group
          .component-type
            label Digit
            button(@click="header.parts.push({name: 'digit', handler: 'random', value: '0'})") +
          //- i.tips 0123456789

          .component-type
            label Alphabet Lowercase
            button(@click="header.parts.push({name: 'alpha', handler: 'random', value: 'a'})") +
          //- i.tips abcdefghijklmnopqrstuvwxyz

          .component-type
            label Alphabet Uppercase
            button(@click="header.parts.push({name: 'ALPHA', handler: 'random', value: 'A'})") +
          //- i.tips ABCDEFGHIJKLMNOPQRSTUVWXYZ

          .component-type
            label Symbols
            button(@click="header.parts.push({name: 'symb', handler: 'random', value: '!'})") +
          //- i.tips ~!@#$%^&()_+-={}[];\',.

        b.component-title Custom
        .component-group
          .component-type
            label Num Range
            button(@click="header.parts.push({name: 'range', handler: 'range', value: getValue('range', index)})") +
            br
            input(type="number", :id="'min' + index", placeholder="start")
            input(type="number", :id="'max' + index", placeholder="end")
          //- i.tips number range

          .component-type
            label Fixed Characters
            button(@click="header.parts.push({name: 'char', handler: 'char', value: getValue('char', index)})") +
            br
            input(type="text", :id="'char' + index", placeholder="inserted as is")
          //- i.tips Will be inserted as per.

          .component-type
            label Custom pool
            button(@click="header.parts.push({name: 'custom', handler: 'custom', value: getValue('custom', index)})") +
            br
            textarea(:id="'textarea' + index", placeholder="values separated by new lines.")
          //- i.tips One random value will be selected.

          //- .component-type(v-if="index !== 0")
          //-   label Reuse previous header
          //-   br

      //- button.close-edit(@click="closeEdit") Close
  .btns
    button.add-header(@click="addHeader") + New Header
    button.generate(@click="processHeader") 🛠️ Generate Data
    p Row Count:
    input.rows(type="number", v-model="rows", placeholder="Rows to generate")
    button.clear-all(@click="this.headers.length = 0") 🗑️ Clear Headers

#results
  h1 Results
  textarea(v-model="csvResults")
  br
  button.download(@click="downloadCsv") 💾 Download CSV
</template>

<script>
import ranGen from 'randomatic'
import json2csv from 'json2csv'
import dayjs from 'dayjs'

import geo from '../data/geo/cities.json'
import female from '../data/names/female.json'
import male from '../data/names/male.json'
import lastname from '../data/names/lastname.json'

export default {
  name: 'App',

  async created () {
    console.log('created')
  },

  async mounted () {
    console.log('mounted')
  },

  data () {
    return {
      tip: 'Click / hover for more',
      headers: [
        {
          name: 'Cities',
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
      rows: 10,
      csvResults: '',
      resultArr: [],

      addHeader () {
        this.headers.push({
          name: '',
          parts: [],
          finalValue: ''
        })
      },

      showHeader (i) {
        const el = document.getElementById('edit' + i)
        if (el.classList.contains('hide')) {
          el.classList.remove('hide')
        } else {
          el.classList.add('hide')
        }
      },

      getValue (type, i) {
        let value = ''

        if (type === 'range') {
          value = [parseInt(window['min' + i].value || 0), parseInt(window['max' + i].value || 0)]
          window['min' + i].value = ''
          window['max' + i].value = ''
        } else if (type === 'char') {
          value = window['char' + i].value.trim() || ''
          window['char' + i].value = ''
        } else if (type === 'custom') {
          value = window['textarea' + i].value.split('\n')
          window['textarea' + i].value = ''
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
          const arr = arguments[0]
          result = arr[getRand(arr.length)]
        }

        return result
      },

      displayTip (param) {
        switch (param) {
          case 'female':
            this.tip = 'Randomized from the list of 1000 female names'
            break
          case 'male':
            this.tip = 'Randomized from the list of 1000 male names'
            break
        }
        // console.log(param)
      },

      downloadCsv () {
        const element = document.createElement('a')
        element.style.display = 'none'

        element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(this.csvResults))
        element.setAttribute('download', 'seed-gen-' + dayjs().format('HHmmss') + '.csv')

        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      },

      processInput () {
        for (let i = 0; i < this.headers.length; i++) {
          const header = this.headers[i]
          let finalValue = ''

          for (let j = 0; j < header.parts.length; j++) {
            const part = header.parts[j]

            if (part.handler === 'default') {
              switch (part.name) {
                case 'geo':
                  finalValue += this.randomInRange(geo).name
                  break
                case 'female':
                  finalValue += this.randomInRange(female).name
                  break
                case 'male':
                  finalValue += this.randomInRange(male).name
                  break
                case 'lastname':
                  finalValue += this.randomInRange(lastname).name
                  break
              }
            } else if (part.handler === 'random') {
              finalValue += ranGen(part.value)
            } else if (part.handler === 'range') {
              finalValue += this.randomInRange(part.value[0], part.value[1])
            } else if (part.handler === 'char') {
              finalValue += part.value
            } else if (part.handler === 'custom') {
              finalValue += this.randomInRange(part.value)
            }

            header.finalValue = finalValue
          }
        }
      },

      processHeader () {
        this.resultArr.length = 0
        for (let j = 0; j < this.rows; j++) {
          const obj = {}
          this.processInput()

          for (let i = 0; i < this.headers.length; i++) {
            const header = this.headers[i]
            obj[header.name] = header.finalValue
          }

          this.resultArr.push(obj)
        }

        const fields = Object.keys(this.resultArr[0])
        this.csvResults = ''

        json2csv.parseAsync(this.resultArr, { fields })
          .then(res => (this.csvResults = res))
          .catch(err => console.log(err))
      }
    }
  }
}
</script>

<style lang="sass">
@import app
</style>
