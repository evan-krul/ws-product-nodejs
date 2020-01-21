const DB = require('../DB')

module.exports = function(app) {
    app.get('/stats/hourly', (req, res, next) => {
      req.sqlQuery = `
        SELECT date, hour, impressions, clicks, revenue
        FROM public.hourly_stats
        ORDER BY date, hour
        LIMIT 168;
      `
      return next()
    }, DB.PGQueryHandler)

    app.get('/stats/daily', (req, res, next) => {
      req.sqlQuery = `
        SELECT date,
            SUM(impressions) AS impressions,
            SUM(clicks) AS clicks,
            SUM(revenue) AS revenue
        FROM public.hourly_stats
        GROUP BY date
        ORDER BY date
        LIMIT 7;
      `
      return next()
    }, DB.PGQueryHandler)
}
