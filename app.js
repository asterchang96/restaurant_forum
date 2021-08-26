const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const db = require('./models')
const app = express()
const port = 3000

// setup handlebars / bodyParser / session&flash
app.engine('handlebars', handlebars({ defaultLayout : 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

// 把 req.flash 放到 res.locals 裡
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
/*   db.sequelize.sync() */
  console.log(`Example app listening at http://localhost:${port}`)
})



//需放最後 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)
module.exports = app
