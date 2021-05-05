function afterMiddleware(req, res, next) {
  console.log('afterMiddleware')
  console.log(req['user'])
  next()
}


module.exports = afterMiddleware
