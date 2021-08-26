
FROM_URL="mongodb://127.0.0.1:27017/new"
TO_URL="mongodb+srv://superadmin:Uk0lMX1PWWsMwtx1@baccarat-app.yeclo.mongodb.net/new?authSource=admin&replicaSet=atlas-8x592k-shard-0&readPreference=primary&ssl=true"
FROM_DB="new.*"
TO_DB="new.*"

mongodump --uri "$FROM_URL" --gzip --archive | mongorestore --uri "$TO_URL" \
--nsFrom="$FROM_DB" --nsTo="$TO_DB" --gzip --archive
