import 'dotenv/config'

export default {
    port: process.env.TEST_PORT || 3000,
    dbUri: process.env.TEST_DB_URI
}