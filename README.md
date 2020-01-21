My solution to [Product 2B](https://gist.github.com/woozyking/126fdf4c72fdf65a3504e5681a1ce715#1-server-side-rate-limiting) for EQ-Works Work Sample.

### Remote Connection
_**Recommended**_
The container is currently hosted on an Azure VM and can be accessed at http://eq.krul.ca:5555/

### Running Locally
 - Create a `.env` file in the directory of `docker-compose.yml`. The file should have:
 -- The PostgreSQL credentials provided, aswell as
```
#Redis Database Credentials
REDISHOST=redis://172.18.0.3:6379

#Rate Limit Settings

## CONFIG EXAMPLE ##
# The settings below are for 100 requests per hour split into 60 minute long segments
# each with a maximum of 60 seconds.

# Number of seconds for timout
RATELIMIT_TIMESLICE=3600
# Number of requests per timeslice
RATELIMIT_REQUEST_LIMIT=360
# Number of 'chunks' of timeslice to enfore to ballance of requests
RATELIMIT_CHUNKBALLENCE=60
```
 - Run `docker-compose up -d`
 - Port 5555 should be active
 - Deploy a Redis container and add it to the node docker containers network
 -- Ensure it is on the correct port specified in the node docker containers `.env`
