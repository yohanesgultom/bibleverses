var assert = require('assert'),
    util = require('util'),
    helper = require('./helper')

var res = null
res = helper.parseVerseLocation('Yohanes 3:16')
console.log(util.inspect(res, false, null))
assert.deepEqual(res, {book: 'yohanes', parts: [{chapter: 3, verses: [16]}]})

res = helper.parseVerseLocation('Yohanes 3:16-18')
console.log(util.inspect(res, false, null))
assert.deepEqual(res, {book: 'yohanes', parts: [{chapter: 3, verses: [16,17,18]}]})

res = helper.parseVerseLocation('Yohanes 3:16,18')
console.log(util.inspect(res, false, null))
assert.deepEqual(res, {book: 'yohanes', parts: [{chapter: 3, verses: [16,18]}]})

res = helper.parseVerseLocation('Yohanes 3:16-18,20')
console.log(util.inspect(res, false, null))
assert.deepEqual(res, {book: 'yohanes', parts: [{chapter: 3, verses: [16,17,18,20]}]})

var promises = []

promises.push(new Promise(function (resolve, reject) {
    helper.getVerses(helper.parseVerseLocation('Yohanes 3:16'), function (err, text) {
        if (err) {
            reject(err)
        } else {
            assert.equal(text, 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.')
            resolve(text)
        }
    })
}))

promises.push(new Promise(function (resolve, reject) {
    helper.getVerses(helper.parseVerseLocation('Yohanes 3:16-18'), function (err, text) {
        if (err) {
            reject(err)
        } else {
            assert.equal(text, 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.Sebab Allah mengutus Anak-Nya ke dalam dunia bukan untuk menghakimi dunia, melainkan untuk menyelamatkannya oleh Dia.Barangsiapa percaya kepada-Nya, ia tidak akan dihukum; barangsiapa tidak percaya, ia telah berada di bawah hukuman, sebab ia tidak percaya dalam nama Anak Tunggal Allah.')
            resolve(text)
        }
    })
}))

promises.push(new Promise(function (resolve, reject) {
    helper.getVerses(helper.parseVerseLocation('Yohanes 3:16,18'), function (err, text) {
        if (err) {
            reject(err)
        } else {
            assert.equal(text, 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.Barangsiapa percaya kepada-Nya, ia tidak akan dihukum; barangsiapa tidak percaya, ia telah berada di bawah hukuman, sebab ia tidak percaya dalam nama Anak Tunggal Allah.')
            resolve(text)
        }
    })
}))

promises.push(new Promise(function (resolve, reject) {
    helper.getVerses(helper.parseVerseLocation('Yohanes 3:16-18,20'), function (err, text) {
        if (err) {
            reject(err)
        } else {
            assert.equal(text, 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.Sebab Allah mengutus Anak-Nya ke dalam dunia bukan untuk menghakimi dunia, melainkan untuk menyelamatkannya oleh Dia.Barangsiapa percaya kepada-Nya, ia tidak akan dihukum; barangsiapa tidak percaya, ia telah berada di bawah hukuman, sebab ia tidak percaya dalam nama Anak Tunggal Allah.Sebab barangsiapa berbuat jahat, membenci terang dan tidak datang kepada terang itu, supaya perbuatan-perbuatannya yang jahat itu tidak nampak;')
            resolve(text)
        }
    })
}))

Promise.all(promises).then(function (values) {
    console.log('\x1b[32m' + 'OK' + '\x1b[0m')
}, function (err) {
    console.log(err)
})
