const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User


const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    //error message
    if(password !== passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.render('signup', { name, email, password, passwordCheck })
    }
    User.findOne({ where: { email: email}})
      .then(user => {
        if(user){
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        }else{
          User.create({
            name: name,
            email: email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
  },

  signInPage: (req, res) => {
    /* return res.redirect('/signin') */
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_message', '成功登入！')
    return res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_message', '成功登出！')
    req.logout()
    return res.redirect('/signin')
  }
}

module.exports = userController