class BaseResponse {

  static success(data, message, success) {
    return {
      success: success ? false : true,
      message: message || 'Success retrieving data.',
      data: data
    }
  }

}


module.exports = BaseResponse
