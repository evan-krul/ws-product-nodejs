const DB = require('../DB')

module.exports = function(app) {
    app.get('/poi', (req, res, next) => {
        req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
        return next()
    }, DB.PGQueryHandler)
}
