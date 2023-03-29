const serialize = {
    objectToParam(obj) {
        if (obj) {
            const str = Object.keys(obj).map(function (key) {
                return key + '=' + obj[key];
            }).join('&')

            return str
        }
        
        return ''
    }
}

export default serialize