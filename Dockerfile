FROM node
ENV A_DB_URL http://user:pass@couchdb:5984/foo
ENV A_DB_STARTING_SEQUENCE 0 
ENV B_DB_URL http://user:pass@couchdb:5984/bar
ENV B_DB_STARTING_SEQUENCE 0 
RUN mkdir /app/
WORKDIR /app/
ADD package.json /app/package.json
RUN npm install
ADD ./src/ /app/src/
ENTRYPOINT npm start 
