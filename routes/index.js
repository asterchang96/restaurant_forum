const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

module.exports = (app) => {

  // 前台
  //如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get('/', (req, res) => {
    res.redirect('/restaurants')
  })

  //在 /restaurants 底下則交給 restController.function 處理
  app.get('/restaurants', restController.getRestaurants)
  
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  //後台
  app.get('/admin', (req, res) => {
    res.redirect('/admin/restaurants')
  })

  app.get('/admin/restaurants', adminController.getRestaurants)

}
