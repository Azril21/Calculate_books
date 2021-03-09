// load library and create app object
const express = require('express')
const app = express()
const path = require('path')

let users = []

app.use(express.static(__dirname + '/public'))


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

//Routes-----

// create user and Favourite books

app.get('/favorite', function(req, res) {
    res.sendFile(__dirname + 'favorite.html')
})

app.get('/highestCount', function(req, res) {
    res.sendFile(__dirname + '/highestCount.html')
})

app.get('/create', function(req, res) {
    let user = {
        usename: req.query.username,
        favobook: req.query.favoriteBook,
    }
    users.push(user)
    res.status(201).redirect('/')
})

// shows all the users data
app.get('/showUsers', function(req, res) {
    let data = JSON.stringify(users)
    res.send(data)
})

// calculate favorite book of user
let newstack = [];
app.get('/calculate', function(req, res) {

    for (let el of users) {
        let newobject = {};
        newobject.favobook = el.favobook
        newobject.count = 0;
        newstack.push(newobject)

        for (let el2 of newstack)
            if (el.favobook === el2.favobook) {
                el2.count += 1
            }
    }

    res.status(201).redirect('/calBooks')
})

app.get('/calBooks', function(req, res) {
    let data = JSON.stringify(newstack)
    res.send(data)
})

//find the highest count and hence the favorite book
let high = [];

app.get('/showFav', function(req, res) {

    let reduce = function(func, data, init) {
        let cumulative = init

        for (let item of data) {
            cumulative = func(cumulative, item.count)
        }

        return cumulative
    }

    let findHighest = function(champion, val) {
        if (val > champion) {
            return val
        } else {
            return champion
        }
    }

    let start_val = newstack[0].count
    let remaining_data = newstack.splice(1, newstack.length)

    let highest = reduce(findHighest, remaining_data, start_val)

    for (let el of newstack) {
        if (el.count === highest) {
            high.push(el)
        }
    }

    let data = JSON.stringify(high)
    res.send(data)
})

app.listen(3000)
console.log('server is running on port 3000')