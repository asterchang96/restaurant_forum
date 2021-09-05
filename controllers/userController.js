const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    //error message
    if(password !== passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.render('signup', { name, email, password, passwordCheck })
    }
    User.findOne({ where: { email: email}})
      .then(user => {
        if(user){
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        }else{
          User.create({
            name: name,
            email: email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
  },

  signInPage: (req, res) => {
    /* return res.redirect('/signin') */
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_message', '成功登入！')
    return res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_message', '成功登出！')
    req.logout()
    return res.redirect('/signin')
  },

  getUser: (req, res) => {
    Promise.all([Comment.findAll({raw: true, nest: true, include: [Restaurant], where:{UserId: req.user.id}}), User.findByPk(req.user.id)])
    .then(result => {
      const [comment, user] = result
      return res.render('users/profile', { user: user.toJSON(), comment})
    })
  },

  editUser: (req, res) => {
    return res.render(`users/edit`)
  },

  putUser: (req, res) => {
    const { file } = req

    if(file){
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name:req.body.name,
              image: file ? img.data.link : user.image,
            })
          })
          .then((user) => {
            req.flash('success_messages', "已成功修改！")
            res.redirect('/users/profile')
          })
      })
    }
    else{
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name:req.body.name,
            image: user.image,
          })
        })
        .then((user) => {
          req.flash('success_messages', "已成功修改！")
          res.redirect('/users/profile')
        })      
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        req.flash('success_messages', '已最愛')
        return res.redirect('back')
      })
      .catch((error) => {console.log(error)})
  },
  
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            req.flash('success_messages', '不愛了')
            return res.redirect('back')
          })
      })
      .catch((error) => {console.log(error)})

  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => {
        req.flash('success_messages', '已按讚')
        return res.redirect('back')
      })
      .catch((error) => {console.log(error)})

  },
  
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            req.flash('success_messages', '取消讚')
            return res.redirect('back')
          })
      })
      .catch((error) => {console.log(error)})
  },
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  }

}

module.exports = userController