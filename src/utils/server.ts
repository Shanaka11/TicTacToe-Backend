import cors from 'cors'
import express from 'express'
import routes from '../routes'

const createServer = () => {
    const app = express()
    app.use(express.json())
    app.use(cors({
        origin: 'http://localhost:3000'
    }))
    routes(app)
    return app
}

export default createServer