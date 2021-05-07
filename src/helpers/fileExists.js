function fileExists(file) {
  /**
   * Return undefined if file does not exist.
   */
  try {
    if ( require('fs').existsSync(file) ) {
      return file
    } else {
      return undefined
    }
  } catch (err) {
    console.log(err)
  }
}


module.exports = fileExists
