const MongoClient = require("mongodb").MongoClient
const NodeEnvironment = require("jest-environment-node")
module.exports = class MongoEnvironment extends NodeEnvironment {
  async setup() {
    if (!this.global.mflixClient) {
      const host = process.env.MFLIX_DB_URI
      this.global.mflixClient = await MongoClient.connect(
        host,
        // TODO: Connection Pooling
        // Set the connection pool size to 50 for the testing environment.
        // TODO: Timeouts
        // Set the write timeout limit to 2500 milliseconds for the testing environment.
        // Note that simply putting wtimeout is deprecated. So use writeConcern
        { poolSize: 50, writeConcern: { w: "majority", wtimeout: 2500 } },
        { useNewUrlParser: true },
      )
      await super.setup()
    }
  }

  async teardown() {
    await this.global.mflixClient.close()
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}
