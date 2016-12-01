var sqlite3 = require('sqlite3').verbose()

// constants
var singleVerseRegex = /(\w+)\s*(\d{1,3}):(\d{1,3})$/i,
    continuousVersesRegex = /(\w+)\s*(\d{1,3}):([\d{1,3}-]+)$/i,
    multipleVersesRegex = /(\w+)\s*(\d{1,3}):([\d{1,3},]+)$/i

var db = new sqlite3.Database('./bible.db')

module.exports = {
    parseVerseLocation: parseVerseLocation,
    getVerses: getVerses
}

/**
 * Parse location string (eg. Yohanes 3:16) to criteria object
 */
function parseVerseLocation(location) {
    var parsedVerses = [],
        match = location.match(singleVerseRegex)
    if (match) {
        parsedVerses = [parseInt(match[3])]
    } else {
        match = location.match(continuousVersesRegex)
        match = match ? match : location.match(multipleVersesRegex)
        if (match) {
            parsedVerses = []
            match[3].split(',').forEach(function(s) {
                var byDash = s.split('-')
                if (byDash.length > 1) {
                    var start = parseInt(byDash[0]),
                        end = parseInt(byDash[1])
                    for (var i = start; i <= end; i++) {
                        parsedVerses.push(parseInt(i))
                    }
                } else {
                    parsedVerses.push(parseInt(s))
                }
            })
        }
    }
    if (match) {
        return {
            book: match[1].toLowerCase(),
            parts: [{chapter: parseInt(match[2]), verses: parsedVerses}]
        }
    }
    return match
}

/**
 * Retrieve verse(s) by criteria
 */
function getVerses(criteria, callback) {
    var query = "SELECT * FROM tb WHERE book='{0}' AND chapter={1} AND verse IN ({2})"
    query = query.replace('{0}', criteria.book)
        .replace('{1}', criteria.parts[0].chapter)
        .replace('{2}', criteria.parts[0].verses.join(','))
    db.all(query, function(err, rows){
        var text = ''
        if (!err && rows) {
            rows.forEach(function (row) {
                if (text != '') text += ' '
                text += row.text.trim().replace('/', '').replace('*', '')
            })
        }
        callback(err, text)
    })
}
