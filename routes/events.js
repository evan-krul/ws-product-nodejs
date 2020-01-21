const DB = require('../DB')

module.exports = function (app) {
    app.get('/events/hourly', (req, res, next) => {
        req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `
        return next()
    }, DB.PGQueryHandler)

    app.get('/events/daily', (req, res, next) => {
        req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
        return next()
    },  DB.PGQueryHandler)
}
