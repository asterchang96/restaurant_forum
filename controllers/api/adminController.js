const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminServices = require('../../services/adminServices.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminServices.getRestaurants(req, res, (data) =>{
      return res.json(data)
    })
  }
}
module.exports = adminController