
CREATE USER danny WITH ENCRYPTED PASSWORD 'danny';
ALTER ROLE danny SET client_encoding TO 'utf8';
ALTER ROLE danny SET default_transaction_isolation TO 'read committed';
ALTER ROLE danny SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE exercises TO danny;