import axios from 'axios'
const baseUrl = process.env.API_BASE || ''

const queryString = (url, parmas) => {
    const str = Object.keys(parmas).reduce((result, key) => {
        result += `${key}=${parmas[key]}&`
        return result
    }, '')
    return `${url}?${str.substr(0, str.length - 1)}`
    
}

export const get = (url, parmas) => {
    return new Promise((resolve, reject) => {
        console.log(parmas)
        axios.get(queryString(`${baseUrl}/api${url}`, parmas))
            .then(res => {
                // console.log('data', res.data)
                resolve(res.data)
            }).catch(reject)
    })
}