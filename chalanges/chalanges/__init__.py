import psycopg2
import getpass

DB_NAME = "postgres"
DB_USER = "IdontKnow"
#DB_PASS = getpass.getpass(prompt='Password: ')
DB_PASS = '#QMrlj76#R'
DB_HOST = "localhost"
DB_PORT = "5432"

conn = psycopg2.connect("dbname=chalanges user=postgres password=#QMrlj76#R")
cur = conn.cursor()
cur.execute('SELECT version();')
db_version = cur.fetchone()
print(db_version)

