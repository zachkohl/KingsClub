-- cat sql/working.sql | heroku pg:psql --app kings-club

-- https://www.tutorialspoint.com/postgresql/postgresql_drop_table.htm
-- DROP TABLE table_name;

--http://www.postgresqltutorial.com/postgresql-add-column/
-- ALTER TABLE table_name
-- ADD COLUMN new_column_name data_type;


-- http://www.postgresqltutorial.com/postgresql-drop-column/
-- ALTER TABLE table_name 
-- DROP COLUMN column_name;

-- CREATE TABLE adult
-- (
--     adult_id serial PRIMARY KEY,
--     adult_name VARCHAR (255) UNIQUE NOT NULL,
--     adult_photo VARCHAR

-- );

-- CREATE TABLE child
-- (
--     child_id serial PRIMARY KEY,
--     child_name VARCHAR (255) UNIQUE NOT NULL,
--     child_photo VARCHAR

-- );

-- CREATE TABLE adult_child
-- (
--     adult_id int REFERENCES adult (adult_id) ON UPDATE CASCADE ON DELETE CASCADE,
--     --if you update the ID, in adult, it will update the id in adult_child, and if you delete an adult, it will delete all their relationships in adult_child
--     child_id int REFERENCES child (child_id) ON UPDATE CASCADE ON DELETE CASCADE,
--     CONSTRAINT adult_child_pkey PRIMARY KEY (adult_id, child_id) --This is to make the queries go faster. 
-- );

-- CREATE TABLE signin
-- (
-- signin_id serial PRIMARY KEY,
-- signin_child_id int NOT NULL,
-- signin_child_name VARCHAR (255),
-- signin_intime timestamptz NOT NULL,
-- signin_outtime timestamptz

-- );

-- ALTER TABLE child DROP COLUMN signedin;
-- ALTER TABLE child ADD COLUMN child_signedin boolean DEFAULT FALSE;

DO $$ BEGIN IF (SELECT child.child_signedin FROM child WHERE child.child_name = 'mell') IS TRUE THEN INSERT INTO signin (signin_child_id,signin_child_name,signin_intime)
      VALUES (12,mell,'2018-09-24 21:46:06.249+00'); END IF; END $$

--https://stackoverflow.com/questions/9789736/how-to-implement-a-many-to-many-relationship-in-postgresql

--https://rob.conery.io/2015/02/08/inserting-using-new-record-postgres/

--join types explained
--http://www.sql-join.com/sql-join-types/



