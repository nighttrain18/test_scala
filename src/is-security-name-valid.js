const isSecurityNameValid = name => {
    const nameChunks = name.split(' ')
    const spacesCount = nameChunks.length - 1
    if(spacesCount > 1) {
        return false
    }

    for(const nameChunk of nameChunks) {
        const matched = nameChunk.match('[а-яА-Я0-9]+')
        if(!matched) {
            return false
        }

        if(nameChunk.length != matched[0].length) {
            return false
        }
    }
    
    return true
}

module.exports = {
    isSecurityNameValid
}