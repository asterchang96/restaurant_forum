const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category


const categoryServices = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            return callback({ 
              categories: categories, 
              category: category.toJSON() 
            })
          })
      } else {
        return callback({ categories: categories })
      }
    })
  },
  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({ 'status': 'error', 'message': 'name didn\'t exist'})
    } else {
      return Category.create({
        name: name
      })
        .then((category) => {
          callback({ 'status': 'success', 'message': ''})
        })
    }
  },
  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ 'status': 'error', 'message': 'name doesn\'t exist'})
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              callback({ 'status': 'success', 'message': ''})
            })
        })
    }
  },
  deleteCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            callback({ 'status': 'success', 'message': ''})
          })
      })
  }
}

module.exports = categoryServices