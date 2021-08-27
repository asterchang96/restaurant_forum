const db = require('../models')
const Restaurant = db.Restaurant

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
    const { name, tel, address, opening_hours, description } = req.body
    if(!name){
      req.flash('error_messages', '名字不存在！')
      return res.redirect('back')
    }
    return Restaurant.create({ 
      name: name,
      tel: tel,
      address: address,
      opening_hours: opening_hours,
      description: description
    })
    .then((restaurant) =>{
      req.flash('success_messages', '餐廳已成功建立！')
      res.redirect('/admin/restaurants')
    })
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
    if(!name){
      req.flash('error_messages', "名字不存在！")
      return res.redirect('back')
    }

    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.update({
          name: name,
          tel:tel,
          address:address,
          opening_hours: opening_hours,
          description: description
        })
        .then((restaurant) => {
          req.flash('success_messages', "餐廳已成功修改！")
          res.redirect('/admin/restaurants')
        })
      })
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