/**
 * Simple module to isolate the DB connection
 * This module could probably be split for PG and Redis
 */

// POSTGRES
const pg = require('pg')

const DB = function () {};

// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
DB.pgPool = new pg.Pool()

DB.PGQueryHandler = (req, res, next) => {
    DB.pgPool.query(req.sqlQuery).then((r) => {
        return res.json(r.rows || [])
    }).catch(next)
}


// REDIS
DB.redis = require('redis')

DB.redisClient = DB.redis.createClient(process.env.REDISHOST)

module.exports = DB;
