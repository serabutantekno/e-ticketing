class BaseResponse {

  static initialData(data) {
    return {
      id      : data.id,
      username: data.username,
      fullName: data.fullName,
      role    : data.role
    }
  }

  static success(user, message, additional) {
    const data = BaseResponse.initialData(user)
    if (additional) {
      for (let item in additional) {
        data[item] = additional[item]
      }
    }
    return {
      success: true,
      message: message || 'Success retrieving data.',
      data: data
    }
  }

}


module.exports = BaseResponse
