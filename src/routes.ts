import { Express, Request, Response } from 'express'
import { createGameHandler, getGameHandler, getGamesHandler, makeMoveHandler } from './game/game.controller'
import { getGameScehma, MakeMoveInput, makeMoveSchema } from './game/game.types'
import validate from './middleware/validateResource'

const routes = (app:Express) => {
    app.get('/test', (req:Request, res:Response) => {
        res.sendStatus(200)
    })
    // Create Games
    app.post('/api/games', createGameHandler)
    // Make Move
    app.post('/api/games/:id/move', validate(makeMoveSchema), makeMoveHandler)
    // Get Game
    app.get('/api/games/:id', validate(getGameScehma), getGameHandler)
    // Get Games
    app.get('/api/games', getGamesHandler)
}

export default routes