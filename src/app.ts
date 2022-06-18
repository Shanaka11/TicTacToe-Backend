import config from 'config'
import createServer from './utils/server'
import connect from './utils/connect'
import logger from './utils/logger'

const port = config.get<number>('port')

const app = createServer()

app.listen(port, async () => {
    logger.info(`App is runnig at http://localhost:${port}`)
    await connect()
})