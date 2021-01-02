const parser = require('csv-parser')
const fs = require('fs')
const path = require('path')

fs.createReadStream(path.resolve(__dirname + '/names/lastname.csv'))
  .pipe(parser())
  .on('data', d => {
    d.name = d.name.charAt(0) + d.name.slice(1).toLowerCase()
    fs.appendFileSync(
      path.resolve(__dirname + '/names/lastname.json'),
      JSON.stringify(d) + ','
    )
    // console.log(d.name.charAt(0) + d.name.slice(1).toLowerCase())
  })
