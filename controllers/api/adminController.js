const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminServices = require('../../services/adminServices.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminServices.getRestaurants(req, res, (data) =>{
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    adminServices.getRestaurant(req, res, (data) =>{
      return res.json(data)
    })
  },
  deleteRestaurant: (req, res) => {
    adminServices.deleteRestaurant(req, res, (data) =>{
      return res.json({ status: 'success', message: '' })
    })
  }
}

module.exports = adminController