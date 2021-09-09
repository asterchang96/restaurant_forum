const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminServices = {
  getRestaurants: (req, res ,callback) => {
    return Restaurant.findAll({ 
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants =>{
      callback({ restaurants: restaurants})
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    }).then(restaurant => {
      callback({ restaurant: restaurant.toJSON() })
    })
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy()
        .then((restaurant) => {
          callback({ status: 'success', message: ''})
        })
    })
  },

  postRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req 
    if(!name){
      callback({ status: 'error', message: "請輸入名字！"})
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
          CategoryId: categoryId
        })
          .then((restaurant) => {
            callback({ status: 'success', message: "餐廳已成功建立！"})
          })
      })
    }else{
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: categoryId
    }).then((restaurant) =>{
      callback({ status: 'success', message: "餐廳已成功建立！"})
    })
    }
  },

  putRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req

    if(!name){
      callback({ status: 'error', message: "名字不存在！"})
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
              image: file ? img.data.link : restaurant.image, //更新或保留原本值
              CategoryId: categoryId
              })
              .then((restaurant) => {
                callback({ status: 'success', message: "餐廳已成功修改！"})
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
            image: restaurant.image,
            CategoryId: categoryId
          })
          .then((restaurant) => {
            callback({ status: 'success', message: "餐廳已成功修改！"})
          })
        }) 
    }
  },
}

module.exports = adminServices