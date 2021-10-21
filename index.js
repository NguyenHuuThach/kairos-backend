const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
const methodOverride = require('method-override')


const { ROLE, users } = require('./data')
const { authUser, authRole } = require('./basicAuth')
const { findUserById, filterUserByName, getUsers, deleteUserById } = require('./service.user')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use(setUser)

app.set('view-engine', 'ejs')




app.get('/', authUser, (req, res) => {
    const user = findUserById(req.session.userId, users)
    const { name, email } = user
    res.render('index.ejs', {  email, name  })
})

app.get('/user', authUser, (req, res) => {
    const user = findUserById(req.session.userId, users)
    const { name, email } = user
    res.render('update.ejs', {  email, name  })
})

app.get('/login', (req, res) => {
    res.render('login.ejs', { error: '' })
})

app.get('/signup', (req, res) => {
    res.render('signup.ejs')
})

app.get('/dashboard', authUser, authRole(ROLE.ADMIN), (req, res) => {
    const result = getUsers(users)
    res.render('dashboard.ejs', { users: result})
})

app.post('/login', loginUser, (req, res) => {
    res.redirect('/');
})

app.post('/signup', signupUser, (req, res) => {
    res.redirect('/');
})

app.post('/user/filter', authUser, authRole(ROLE.ADMIN), (req, res) => {
    const userArray = getUsers(users)
    const result = filterUserByName(req.body.name, userArray).length > 0 ? filterUserByName(req.body.name, userArray) : getUsers(users)
    res.render('dashboard.ejs', { users: result })
})

app.put('/user', updateUser, (req, res) => {
    res.redirect('/');
})

app.delete('/user/:id', authUser, authRole(ROLE.ADMIN), (req, res) => {
    deleteUserById(req.params.id, users)
    const result =  getUsers(users)
    res.render('dashboard.ejs', { users: result})
})

app.delete('/logout', logout)





function loginUser(req, res, next) {
    const { email } = req.body

    if (email) {
        const user = users.find(user => user.email === email)
        if (user) {
            req.session.userId = user.id
            req.session.role = user.role
        }
    }

    next()
}

function signupUser(req, res, next) {
    const { name, email } = req.body
    
    if (name && email) {
        const exist = users.some(user => user.email === email)

        if(exist) {
            return res.redirect('/signup')
        }

        if (!exist) {
            const user = { id: users.length + 1, name, email, role: ROLE.BASIC }
            users.push(user)
            req.session.userId = user.id
            req.session.role = user.role
        }
    }

    next()
}

function updateUser(req, res, next) {
    const { name, email } = req.body
    const user = findUserById(req.session.userId, users)

    if (name && (name !== user.name)) {
        users[user.id - 1].name = name
    }
    if (email && (email !== user.email)) {
        users[user.id - 1].email = email
    }

    next()
}

function logout(req, res, next) {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/')
        }
        return res.redirect('/login')
    })
}






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})