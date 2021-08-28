
FROM_URL="mongodb://127.0.0.1:27017/main"
TO_URL="mongodb+srv://superadmin:Uk0lMX1PWWsMwtx1@baccarat-app.yeclo.mongodb.net/baccarat"
FROM_DB="main.*"
TO_DB="main.*"

mongodump --uri "$FROM_URL" --gzip --archive  | mongorestore --uri "$TO_URL" \
--nsFrom="$FROM_DB" --nsTo="$TO_DB" --nsInclude="$FROM_DB" --gzip --archive
