const pouchdb = require('pouchdb')

module.exports = async function(change, sourceDb) {
  // Bail if it's a design doc.
  if (change.id.includes('_design')) return
  const sourceDoc = await sourceDb.get(change.id)
  const modifiedByPropertyName = process.env.MODIFIED_BY_PROPERTY_NAME
  if (sourceDoc[modifiedByPropertyName] !== 'conflict-free-sync') {
    const transferDoc = {...sourceDoc}
    const targetDbUrl = sourceDb.name !== process.env.A_DB_URL
      ? process.env.A_DB_URL
      : process.env.B_DB_URL
    const targetDb = new pouchdb(targetDbUrl)
    try {
      const targetDoc = await targetDb.get(change.id)
      // Bail if we've already processed this in cases where there is more than one changelog entry for a doc on the same revision.
      if (targetDoc.lastConflictFreeSourceDocRev === sourceDoc._rev) return
      transferDoc._rev = targetDoc._rev
    } catch (e) {
      // Doc being transferred is a new doc.
      delete transferDoc._rev 
    }
    transferDoc[modifiedByPropertyName] = 'conflict-free-sync'
    transferDoc.lastConflictFreeSourceDocRev = sourceDoc._rev
    await targetDb.put(transferDoc)
  }
}
