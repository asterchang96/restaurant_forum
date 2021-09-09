const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const categoryServices = require('../../services/categoryServices.js')

const categoryController = {
  getCategories: (req, res) => {
      categoryServices.getCategories(req, res, (data) =>{
        return res.json(data)
      })
    },
  postCategory: (req, res) => {
    categoryServices.postCategory(req, res, (data) =>{
        return res.json(data)
    })
  },
  putCategory: (req, res) => {
    categoryServices.putCategory(req, res, (data) =>{
      return res.json(data)
    })
  },
  deleteCategory: (req, res) => {
    categoryServices.deleteCategory(req, res, (data) =>{
      return res.json(data)
    }) 
  }
}

module.exports = categoryController