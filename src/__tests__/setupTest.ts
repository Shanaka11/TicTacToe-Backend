import mongoose from 'mongoose'
import 'dotenv/config'
import logger from '../utils/logger'

const removeAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany({});
    }
}

const dropAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      try {
        await collection.drop();
      } catch (error:any) {
        logger.error(error.message);
      }
    }
}

export const setupDB = (databaseName:string) => {
    // Connect to the test database
    beforeAll(async () => {
        const url = `${process.env.TEST_DB_HOST}/${databaseName}`
        await mongoose.connect(url)
    })

    // Cleans up database between tests
    afterEach(async () => {
        // console.log('afterEach')
        // await removeAllCollections()
    })

    // Disconnect and Clean the database after the testing is done
    afterAll(async () => {
        await dropAllCollections()
        await mongoose.connection.close()
    })

} 