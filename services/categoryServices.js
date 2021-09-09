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
  }
}

module.exports = categoryServices