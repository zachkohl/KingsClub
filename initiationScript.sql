--THE FOLLOWING CODE WILL AFFECT THE DEPOLYMENT DATABASE USE WITH EXTREME CARE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
-- heroku pg:reset postgresql-shaped-81134 --app kings-club --confirm kings-club
-- cat initiationScript.sql | heroku pg:psql --app kings-club
--Use the above line to run this file on your local development computer. 


--To enter PSQL: heroku pg:psql --app kings-club


--         ,     \    /      ,        
--        / \    )\__/(     / \       
--       /   \  (_\  /_)   /   \      
--  ____/_____\__\@  @/___/_____\____ 
-- |             |\../|              |
-- |              \VV/               |
-- |        ----------------         |
-- |_________________________________|
--  |    /\ /      \\       \ /\    | 
--  |  /   V        ))       V   \  | 
--  |/     `       //        '     \| 
--  `              V                '




CREATE TABLE users (
 id serial PRIMARY KEY, 
 username VARCHAR (255) UNIQUE NOT NULL,
 email VARCHAR(255) NOT NULL,
 phone VARCHAR(255) NOT NULL,
 storedhash VARCHAR(255) NOT NULL,
 reviewtime TIME,
 lastupdate TIMESTAMPTZ,
 RoughAlarm TIMESTAMPTZ,
 remindercount int
);

SET timezone = 'America/Los_Angeles';

--YOU MUST use single quotes!
INSERT INTO users (username, email, phone, storedhash,reviewtime) VALUES ('zach', 'zkohl@stargarnet.io','+12087551332','$2b$10$oB66OtEH1ao6smvCxWih8O6cmE/9eKEyqwNOas6F1AxdLyBZICuPO','07:00');


--USED FOR SESSION MANAGEMENT: https://github.com/voxpelli/node-connect-pg-simple/blob/HEAD/table.sql
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

--END


CREATE TABLE goals (
 id serial PRIMARY KEY, 
 title VARCHAR (255) UNIQUE NOT NULL,
 username VARCHAR(255) NOT NULL,
 content TEXT,
 lastupdate TIMESTAMPTZ,
 lastreminder TIMESTAMPTZ,
 remindercount int
);
