import express from 'express'
import session from 'express-session'
import methodOverride from 'method-override'
import bcrypt from 'bcrypt'


const app = express()
const PORT = process.env.PORT || 3000;
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


import { ROLE, users } from './data'
import { authUser, authRole } from './basicAuth'
import { findUserById, filterUserByName, getUsers, deleteUserById } from './service.user'


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





async function loginUser(req, res, next) {
    const { email, password } = req.body

    if (email && password) {
        const user = users.find(user => user.email === email)
        if (user) {
            const isValid = await bcrypt.compare(password, user.password)
            if(isValid) {
                req.session.userId = user.id
                req.session.role = user.role
            }
        }
    }

    next()
}

async function signupUser(req, res, next) {
    const { name, email, password } = req.body
    
    if (name && email && password) {
        const exist = users.some(user => user.email === email)

        if(exist) {
            return res.redirect('/signup')
        }

        if (!exist) {
            const user = { id: users.length + 1, name, email, role: ROLE.BASIC }
            users.push(user)
            users[users.length - 1].password = await bcrypt.hash(password, saltRounds)
            
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
    if ((user.id != 1) && email && (email !== 'admin@gmail.com') && (email !== user.email)) {
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




app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})