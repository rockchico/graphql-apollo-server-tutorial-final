- GraphQL Apollo Tutorial

https://www.robinwieruch.de/graphql-apollo-server-tutorial/

https://github.com/rwieruch/fullstack-apollo-react-express-boilerplate-project

- explicação sobre funcionamento graphQL
https://blog.apollographql.com/graphql-explained-5844742f195e


! tutos oficias apollo
https://www.apollographql.com/docs/apollo-server/
https://www.apollographql.com/docs/react/


! docs sequelize

http://docs.sequelizejs.com/


! COMANDOS GIT
- exibir árvore
git log --pretty=format:"%h %s" --graph

! setar http headers graphql playground{"x-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJtYXJpb0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6Ik1hcmlvIiwicm9sZSI6bnVsbCwiaWF0IjoxNTU3OTQyNzYyLCJleHAiOjE1NTc5NDQ1NjJ9.SuG6IVG0R4BXEoZdReZszfvaciGSPwihChSEKsxHQZw"}


! create postgre tables

postgres=# CREATE USER pguser WITH PASSWORD 'teste123';
CREATE ROLE
postgres=# CREATE DATABASE graphql_tutorial OWNER pguser;
CREATE DATABASE
postgres=#


graphql_tutorial=# GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pguser;



CREATE TABLE user 
(
 id serial PRIMARY KEY,
 createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
 username VARCHAR (255) UNIQUE NOT NULL,
 password VARCHAR (255) NOT NULL,
 email VARCHAR (355) UNIQUE NOT NULL
);

CREATE TABLE message (
 id serial PRIMARY KEY,
 createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
 text VARCHAR (355) UNIQUE NOT NULL
);