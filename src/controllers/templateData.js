class TemplateData {

  static userTemplate(user) {
    return {
      id      : user.id,
      username: user.username,
      fullname: user.fullname,
      email   : user.email,
      role    : user.role,
      photo   : (() => {
        if (!user.photo) {
          return user.photo
        } else {
          return Buffer.from(user.photo, 'base64').toString('utf8').split('|')[1]
        }
      })()
    }
  }


  static userData(user, additional) {

    // array of users
    if (Array.isArray(user)) {
      return user.map(obj => {
        const userData = TemplateData.userTemplate(obj)
        if (additional) {
          for (let item in additional) {
            userData[item] = additional[item]
          }
        }
        return userData
      })
    }

    // single user
    const userTemplate = TemplateData.userTemplate(user)
    if (additional) {
      for (let item in additional) {
        userTemplate[item] = additional[item]
      }
    }

    return userTemplate
  }

}


module.exports = TemplateData
