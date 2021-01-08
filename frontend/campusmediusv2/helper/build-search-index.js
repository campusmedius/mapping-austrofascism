var lunr = require('lunr'),
    stdin = process.stdin,
    stdout = process.stdout,
    buffer = []

// require("lunr-languages/lunr.stemmer.support")(lunr)
// require("lunr-languages/lunr.de")(lunr)

var lang = process.argv[2]

stdin.resume()
stdin.setEncoding('utf8')

stdin.on('data', function (data) {
  buffer.push(data)
})

stdin.on('end', function () {
  var documents = JSON.parse(buffer.join(''))

  var idx = lunr(function () {

    // if (lang === 'de') {
    //   this.use(lunr.de);
    // }

    this.ref('location')
    this.field('text')

    documents.forEach(function (doc) {
      var boost = 1;
      if(doc.type == 'title' || doc.type == 'keywords') {
        boost = 10;
      } else if(doc.type == 'event' || doc.type == 'mediator') {
        boost = 10;
      } else if(doc.type == 'page') {
        boost = 5;
      }
      this.add(doc, { boost: boost })
    }, this)
  })

  stdout.write(JSON.stringify(idx))
})