const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminServices = require('../services/adminServices.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminServices.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  creatRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true,
    }).then(categories => {
      return res.render('admin/create', { categories })
    })
  },

  postRestaurant: (req, res) => {
    adminServices.postRestaurant(req, res, (data) => {
      if(data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      else if(data.status === 'success'){
        req.flash('success_messages',  data.message)
        res.redirect('/admin/restaurants')
      }
    })
  },

  getRestaurant: (req, res) => {
    adminServices.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories: categories, 
          restaurant: restaurant.toJSON()
        })
      })
    })
  },


  putRestaurant: (req, res) => {
    adminServices.putRestaurant(req, res, (data) => {
      if(data.status === 'error')
        req.flash('error_messages', data.message)
      else if(data.status === 'success')
        req.flash('success_messages', data.message)
      return res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminServices.deleteRestaurant(req, res, (data) => {
      if(data.status === 'success') return res.redirect('/admin/restaurants')
    })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw:true }).then(users =>{
      users.forEach(user =>{
        if(user.isAdmin === 1) user.role = "admin"
        else user.role = "user"
      })
      res.render('admin/users', { users })
    })
  },

  toggleAdmin: (req, res) => {
    const userId = req.params.id
    return User.findByPk(userId)
      .then(user =>{
        user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(() => {
        req.flash('success_messages', "使用者權限修改成功！")
        res.redirect('/admin/users')
      })
    
  }
}

module.exports = adminController