const router = require('express').Router()
const axios = require('axios')
const baseUrl = 'https://api.douban.com/v2'
router.get(`/book/search`, function(req, res) {
    axios(`${baseUrl}/book/search`, {
        method: req.method,
        params: req.query
    }).then(r => {
        res.json(r.data)
    }).catch(err => {
        res.json(err.data)
    }) 
})
module.exports = router