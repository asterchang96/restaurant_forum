const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category


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
}

module.exports = adminServices