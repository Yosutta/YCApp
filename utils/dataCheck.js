module.exports = function (obj) {
    for (let i in obj) {
        if (obj[i].length === 0) {
            return false
        }
    }
    return true
}