const pouchdb = require('pouchdb')

module.exports = async function(change, sourceDb) {
  const sourceDoc = await sourceDb.get(change.id)
  if (sourceDoc.lastModifiedBy !== 'conflict-free-sync') {
    const transferDoc = {...sourceDoc}
    const targetDbUrl = sourceDb.name !== process.env.A_DB_URL
      ? process.env.A_DB_URL
      : process.env.B_DB_URL
    const targetDb = new pouchdb(targetDbUrl)
    try {
      const targetDoc = await targetDb.get(change.id)
      transferDoc._rev = targetDoc._rev
    } catch (e) {
      // Doc being transferred is a new doc.
      delete transferDoc._rev 
    }
    transferDoc.lastModifiedBy = 'conflict-free-sync'
    await targetDb.put(transferDoc)
  }
}
