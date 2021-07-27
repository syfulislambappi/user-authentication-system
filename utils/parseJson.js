// json parse with error handling
exports.parseJSON = (jsonString) => {
    let output
    try {
        output = JSON.parse(jsonString)
    } catch (error) {
        output = {}
    }
    return output
}