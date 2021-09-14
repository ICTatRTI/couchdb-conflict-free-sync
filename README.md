# CouchDB Conflict Free Sync

This app replicates two CouchDB databases from specific sequences without creating conflicts between the two databases. You probably don't want to use this just to mute conflicts. This is useful in instances when you have cloned a database and to perform a transformation on it, you want some clients subscribed to the old database and some client subscribed to the new database, but also want changes in the new and old databases to be synced to each other. Setting up a standard couchdb sync from sequence 0 would result in all of the transform operations ending up in the original database, and using standard couchdb sync with a since the clone was made would result in document conflicts where you may not end up with a winner that has the most current data.

## Installation
This app currently assumes you are going to be syncing between two databases, one of which is going to be in a couchdb Docker container named "couchdb" on the same host machine as this app. You could set this up as a node app without the provisioning bash scripts if you are doing something different.

```
cp config.defaults.sh config.sh
# Modify the variables for connecting to database a and b.
vim config.sh
./start.sh
```


## App compatibility
This migration tool depends on your app setting a namespace configurable `modifiedBy` property on every save. If your app does not do this, changes will not replicate. This is necessary because this app will mark your `modifiedBy` property on docs with `"conflict-free-sync"`, which then is how the app knows not to then replicate that change back which would have created an infinite loop.
