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
    categoryServices.putCategory(req, res, (data) =>{
      if(data.status === 'error'){
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      else if(data.status === 'success'){
        return res.redirect('/admin/categories')
      }
    })
  },
  deleteCategory: (req, res) => {
    categoryServices.deleteCategory(req, res, (data) =>{
      if(data.status === 'success'){
        return res.redirect('/admin/categories')
      }
    }) 
  }
}
module.exports = categoryController