var port = 3000,
    express = require('express'),
    stream = require('stream'),
    webshot = require('webshot'),
    helper = require('./helper')

// const
var defaultLocation = 'Yohanes 3:16',
    verseBgColor = '#4e7da7',
    verseColor = '#e2e1e1'

var htmlTemplate = "<html><head><link href='https://fonts.googleapis.com/css?family=Yrsa' rel='stylesheet'><style>body {background-color: {0};color: {1};}.verse {text-align: center;font-family: Yrsa,sans-serif;padding: 10px 50px;}.verse-body {font-size: 23pt; }.verse-location {font-size: x-large; font-weight: bold}</style></head><body><div class='verse verse-body'> {2} </div><div class='verse verse-location'> ({3}) </div></body></html>"

/** express.js routes **/

var app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use('/static', express.static('./static'))

app.get('/render/:location', function (req, res) {
    var location = req.params && req.params.location ? req.params.location : defaultLocation
    var criteria = helper.parseVerseLocation(location)
    helper.getVerses(criteria, function (err, text) {
        if (err) throw err
        var html = htmlTemplate.replace('{0}', verseBgColor)
            .replace('{1}', verseColor)
            .replace('{2}', text)
            .replace('{3}', location)
        console.log(location + ' ' + text)
        var done = false
        webshot(html, {siteType: 'html', windowSize: {height: 400, width: 700}}).on('data', function(img) {
            if (!done) {
                res.writeHead(200, {'Content-Type': 'image/png' })
                res.end(img, 'png')
                done = true
            }
        })
    })
})

app.get('/:location', function (req, res) {
    var location = req.params && req.params.location ? req.params.location : defaultLocation,
        criteria = helper.parseVerseLocation(location),
        result = {}
    helper.getVerses(criteria, function (err, verses) {
        result.location = location
        result.text = verses
        result.img = '/render/' + location
        res.render('index', { verse: result })
    })
})

app.get('/', function (req, res) {
    var location = defaultLocation,
        criteria = helper.parseVerseLocation(location),
        result = {}
    helper.getVerses(criteria, function (err, verses) {
        result.location = location
        result.text = verses
        result.img = '/render/' + location
        res.render('index', { verse: result })
    })
})

// run server
app.listen(port, function () {
  console.log('App running on http://localhost:3000')
})
