function authUser(req, res, next) {
    if (!req.session.userId) {
    //   res.status(403)
    //   res.send('You need to log in')
      return res.redirect('/login')
    }
  
    next()
  }
  
  function authRole(role) {
    return (req, res, next) => {
      if (req.session.role !== role) {
        res.status(401)
        return res.send('Not allowed')
      }
  
      next()
    }
  }

  
  module.exports = {
    authUser,
    authRole,
  }