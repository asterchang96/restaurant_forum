const db = require('../models')
const Restaurant = db.Restaurant
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '92ae2a0a67d0121'

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw:true }).then(restaurants =>{
      return res.render('admin/restaurants', { restaurants })
    })
  },

  creatRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    console.log('確認file', req)
    const { name, tel, address, opening_hours, description } = req.body
    const { file } = req //const file = req.file
    if(!name){
      req.flash('error_messages', '名字不存在！')
      return res.redirect('back')
    }
    if(file){
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({ 
          name: name,
          tel: tel,
          address: address,
          opening_hours: opening_hours,
          description: description,
          image: file ? img.data.link : null,
        })
          .then((restaurant) => {
            req.flash('success_messages', '餐廳已成功建立！')
            res.redirect('/admin/restaurants')
          })
      })
    }else{
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
    }).then((restaurant) =>{
      req.flash('success_messages', '餐廳已成功建立！')
      return res.redirect('/admin/restaurants')
    })
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw:true }).then(restaurant => {
      return res.render('admin/restaurant', { restaurant:restaurant })
    })
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id,{ raw:true }).then(restaurant => {
      return res.render('admin/create', { restaurant:restaurant })
    })
  },


  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    const { file } = req

    if(!name){
      req.flash('error_messages', "名字不存在！")
      return res.redirect('back')
    }
    if(file){
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: name,
              tel:tel,
              address:address,
              opening_hours: opening_hours,
              description: description,
              image: file ? img.data.link : restaurant.image //更新或保留原本值
              })
              .then((restaurant) => {
                req.flash('success_messages', "餐廳已成功修改！")
                res.redirect('/admin/restaurants')
              })
            })          
      })
    }else{
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: name,
            tel:tel,
            address:address,
            opening_hours: opening_hours,
            description: description,
            image: restaurant.image
          })
          .then((restaurant) => {
            req.flash('success_messages', "餐廳已成功修改！")
            res.redirect('/admin/restaurants')
          })
        }) 
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy()
        .then((restaurant) => {
          res.redirect('/admin/restaurants')
        })
    })
  }
}

module.exports = adminController