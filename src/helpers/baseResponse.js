class BaseResponse {

  static success(data, message) {
    return {
      success: true,
      message: message || 'Success retrieving data.',
      data: data
    }
  }

}


module.exports = BaseResponse
