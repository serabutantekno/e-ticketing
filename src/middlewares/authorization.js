function permit(...permittedRoles) {
  return (req, res, next) => {

    const { username, role } = req.user

    if (username && permittedRoles.includes(role)) {
      next()  // role is allowed, so continue on the next middleware
    } else {
      // res.status(403).json({message: "Forbidden!"})  // user is forbidden
      throw new Error('User is forbidden.')
    }
  }
}


module.exports = permit
