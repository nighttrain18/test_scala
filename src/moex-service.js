const axios = require('axios')

class MOEXService {
    FetchSecurities = async secid => {
        return axios.get(`http://iss.moex.com/iss/securities.xml?q=${secid}`)
    }
}

module.exports = MOEXService