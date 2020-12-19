var lunr = require('lunr'),
    stdin = process.stdin,
    stdout = process.stdout,
    buffer = []

stdin.resume()
stdin.setEncoding('utf8')

stdin.on('data', function (data) {
  buffer.push(data)
})

stdin.on('end', function () {
  var documents = JSON.parse(buffer.join(''))

  var idx = lunr(function () {
    this.ref('location')
    this.field('text')

    documents.forEach(function (doc) {
      var boost = 1;
      if(doc.type == 'event' || doc.type == 'mediator') {
        boost = 10;
      } else if(doc.type == 'page') {
        boost = 5;
      }
      this.add(doc, { boost: boost })
    }, this)
  })

  stdout.write(JSON.stringify(idx))
})