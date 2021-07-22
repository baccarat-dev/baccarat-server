
FROM_URL="mongodb+srv://superadmin:Uk0lMX1PWWsMwtx1@baccarat-app.yeclo.mongodb.net/main?authSource=admin&replicaSet=atlas-8x592k-shard-0&readPreference=primary&ssl=true"
TO_URL="mongodb://127.0.0.1:27017/main"
FROM_DB="main.*"
TO_DB="main.*"

mongodump --uri "$FROM_URL" --gzip --archive | mongorestore --uri "$TO_URL" \
--nsFrom="$FROM_DB" --nsTo="$TO_DB" --gzip --archive
