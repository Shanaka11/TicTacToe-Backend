import { Response, Request } from 'express'
import { GetGameInput, MakeMoveInput } from './game.types'
import { createGame, getGame, getGames, makeMove } from './game.services'

// Create Game
export const createGameHandler = async (
    req:Request, 
    res:Response
) => {
    try{
        const game = await createGame()
        return res.send(game)
    }catch(e){
        return res.status(400).send(e.message)
    }
}

// Make Move
export const makeMoveHandler = async (
    req:Request<MakeMoveInput['params'], {}, MakeMoveInput['body']>, 
    res:Response
) => {
    try{
        const moveData = {
            board: req.body.board.map((item:number) => {
                if(item === 1) return 1
                if(item === -1) return -1
                return 0
            })
        }
        const game = await makeMove({'_id': req.params.id}, moveData)
        return res.send(game)
    }catch(e){
        return res.status(400).send(e.message)
    }
}

// Get Game
export const getGameHandler = async (
    req:Request<GetGameInput['params']>, 
    res:Response
) => {
    try{
        const game = await getGame({'_id' : req.params.id})
        return res.send(game)
    }catch(e){
        return res.status(400).send(e.message)
    }
}

// Get Games
export const getGamesHandler = async (
    req:Request,
    res:Response
) => {
    try{
        const games = await getGames()
        return res.send(games)
    }catch(e){
        return res.status(400).send(e.message)
    }
}