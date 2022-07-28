import psycopg2
#import getpass
from dotenv import load_dotenv
from os import getenv
from pathlib import Path

dotenv_path = Path('../../.env')
load_dotenv()

conn = psycopg2.connect("dbname=chalanges user=postgres password="+getenv('ENV_PSQL'))
cur = conn.cursor()
cur.execute('SELECT version();')
db_version = cur.fetchone()
print(db_version)


