// db.js
import postgres from 'postgres'

//DB_NAME = "postgres"
//DB_USER = "IdontKnow"
//DB_PASS = getpass.getpass(prompt='Password: ')
//DB_PASS = '#QMrlj76#R'
//DB_HOST = "localhost"
//DB_PORT = "5432"

const sql = postgres({
  host     : 'localhost',   // Postgres ip address[s] or domain name[s]
  port     : 5432, // Postgres server port[s]
  database : 'users',   // Name of database to connect to
  username : 'postgres',   // Username of database user
  password : '#QMrlj76#R',   // Password of database user
})

export default sql