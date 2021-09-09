const db = require('../models')
const Category = db.Category
const categoryServices = require('../services/categoryServices.js')


let categoryController = {
  getCategories: (req, res) => {
    categoryServices.getCategories(req, res, (data) =>{
      return res.render('admin/categories', data)
    })
  },
  postCategory: (req, res) => {
    categoryServices.postCategory(req, res, (data) =>{
      if(data.status === 'error'){
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      else if(data.status === 'success'){
        return res.redirect('/admin/categories')
      }
    })
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              res.redirect('/admin/categories')
            })
        })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            res.redirect('/admin/categories')
          })
      })
  }
}
module.exports = categoryController