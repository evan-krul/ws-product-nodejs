const DB = require('./DB')
/**
 * Middleware to rate limit
 * If I were to redo this I would implement promises.
 * @param req
 * @param res
 * @param next
 */
module.exports = (req,res,next) => {
    // Redis DB key
    const redis_key = 'IP_'+req.ip+'_RATE_LIMIT';
    const max_request_per_chunk = process.env.RATELIMIT_REQUEST_LIMIT/process.env.RATELIMIT_CHUNKBALLENCE
    const request_chunk_timeslice = process.env.RATELIMIT_TIMESLICE/process.env.RATELIMIT_CHUNKBALLENCE

    // Check if key is in redis
    DB.redisClient.exists(redis_key, (err, reply) => {
        // Check if IP has made a request in time limit
        if (reply === 1) {
            DB.redisClient.get(redis_key, function (redis_err, redis_res) {
                DB.redisClient.ttl(redis_key, function (redis_ttl_err, redis_ttl_res) {
                    res.set('RateLimit-Limit', max_request_per_chunk)
                    res.set('RateLimit-Remaining', max_request_per_chunk-redis_res)
                    res.set('RateLimit-Reset', redis_ttl_res)
                    // Check if rate limit exceeded
                    if (redis_res >= max_request_per_chunk) {
                        res.status(429).send('Rate limit exceeded')
                    } else {
                        DB.redisClient.incr(redis_key)
                        next()
                    }
                })
            })
        } else {
            // Create a new expiring entry in redis
            DB.redisClient.set(redis_key, 1, 'EX', request_chunk_timeslice)
            res.set('RateLimit-Limit', max_request_per_chunk)
            res.set('RateLimit-Remaining', max_request_per_chunk)
            res.set('RateLimit-Reset', request_chunk_timeslice)
            next()
        }
    })
}
