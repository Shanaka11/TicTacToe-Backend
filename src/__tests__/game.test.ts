import supertest from 'supertest'
import Game from '../game/game.model'
import { createGame } from '../game/game.services'
import createServer from '../utils/server'
import { setupDB } from './setupTest'

const app = createServer()
const request = supertest(app)
setupDB('test-game')

describe('game', () => {
    let gameId:string;
    // Create Game
    describe('create game', () => {
        // check if the game is initiated correctly
        it('should retern created game with inital values', async () => {
            // Create the game
            const { statusCode, body } = await request.post('/api/games')
            .send({
            })
            // Fetch the game
            const game = await Game.findById(body._id)
            
            expect(game).toBeTruthy()
            expect(statusCode).toBe(200)

            gameId = game?.id
            // Validate game data
            expect(game?.nextMove).toEqual(1)
            expect(game?.result).toEqual(-2)

        })
    })

    // Make Move -- Happy Path
    describe('Game Move 01 - Player 01', () => {
        it('should return the game object with correct values', async () => {
            //Make Move
            const { statusCode, body } = await request.post(`/api/games/${gameId}/move`)
            .send({
                "board": [1,0,0,0,0,0,0,0,0]
            })
            // Fetch the game
            const game = await Game.findById(body._id)
            
            expect(game).toBeTruthy()
            expect(statusCode).toBe(200)

            // Validate game data
            expect(game?.nextMove).toEqual(-1)
            expect(game?.result).toEqual(-2)
        })
    })

    describe('Game Move 02 - Player 02', () => {
        it('should return the game object with correct values', async  () => {
            //Make Move
            const { statusCode, body } = await request.post(`/api/games/${gameId}/move`)
            .send({
                "board": [1,-1,0,0,0,0,0,0,0]
            })
            // Fetch the game
            const game = await Game.findById(body._id)
            
            expect(game).toBeTruthy()
            expect(statusCode).toBe(200)

            // Validate game data
            expect(game?.nextMove).toEqual(1)
            expect(game?.result).toEqual(-2)
        })
    })

    describe('Game Move 03 - Player 01', () => {
        it('should return the game object with correct values', async () => {
            //Make Move
            const { statusCode, body } = await request.post(`/api/games/${gameId}/move`)
            .send({
                "board": [1,-1,0,1,0,0,0,0,0]
            })
            // Fetch the game
            const game = await Game.findById(body._id)
            
            expect(game).toBeTruthy()
            expect(statusCode).toBe(200)

            // Validate game data
            expect(game?.nextMove).toEqual(-1)
            expect(game?.result).toEqual(-2)            
        })
    })

    // Make Move -- Unhappy Path
    describe('Game Move 04 - Player 01', () => {
        it('should return a 400', async () => {
            const { statusCode, body } = await request.post(`/api/games/${gameId}/move`)
            .send({
                "board": [1,-1,1,1,0,0,0,0,0]
            })
            // Fetch the game
            const game = await Game.findById(gameId)

            expect(statusCode).toBe(400)

            // Validate game data
            expect(game?.nextMove).toEqual(-1)
            expect(game?.result).toEqual(-2)    
        })
    })

    describe('Game Move 05 - Player 02 Tries multiple moves once', () => {
        it('should return a 400', async () => {
            const { statusCode, body } = await request.post(`/api/games/${gameId}/move`)
            .send({
                "board": [1,-1,0,1,0,0,-1,-1,-1]
            })
            // Fetch the game
            const game = await Game.findById(gameId)

            expect(statusCode).toBe(400)

            // Validate game data
            expect(game?.nextMove).toEqual(-1)
            expect(game?.result).toEqual(-2)    
        })
    })

    // Make Move -- Check Win / Draw
    describe('Game Player 1 Wins', () => {
        it('should return the game result as 1', async () => {
            // Create a game first
            const game = await createGame()
            // Add the moves
            game.moves.push({board: [1,0,0,0,0,0,0,0,0]})
            game.moves.push({board: [1,-1,0,0,0,0,0,0,0]})
            game.moves.push({board: [1,-1,0,1,0,0,0,0,0]})
            game.moves.push({board: [1,-1,-1,1,0,0,0,0,0]})
            game.nextMove = 1
            game.save()
            
            const { statusCode, body } = await request.post(`/api/games/${game.id}/move`)
            .send({
                "board": [1,-1,-1,1,0,0,1,0,0]
            })

            const updatedGame = await Game.findById(body._id)

            expect(updatedGame).toBeTruthy()
            expect(statusCode).toBe(200)

            // Validate game data
            expect(updatedGame?.nextMove).toEqual(-1)
            expect(updatedGame?.result).toEqual(1)    
        })
    })

    describe('Game Player 2 Wins', () => {
        it('should return the game result as -1', async () => {
            // Create a game first
            const game = await createGame()
            // Add the moves
            game.moves.push({board: [1,0,0,0,0,0,0,0,0]})
            game.moves.push({board: [1,-1,0,0,0,0,0,0,0]})
            game.moves.push({board: [1,-1,1,0,0,0,0,0,0]})
            game.moves.push({board: [1,-1,1,0,-1,0,0,0,0]})
            game.moves.push({board: [1,-1,1,0,-1,1,0,0,0]})
            game.nextMove = -1
            game.save()
            
            const { statusCode, body } = await request.post(`/api/games/${game.id}/move`)
            .send({
                "board": [1, -1, 1, 0, -1, 1, 0, -1, 0]
            })

            const updatedGame = await Game.findById(body._id)

            expect(updatedGame).toBeTruthy()
            expect(statusCode).toBe(200)

            // Validate game data
            expect(updatedGame?.nextMove).toEqual(1)
            expect(updatedGame?.result).toEqual(-1)    
        })
    })

    describe('Game Draw', () => {
        it('should return the game result as 0', async () => {
            // Create a game first
            const game = await createGame()
            // Add the moves
            game.moves.push({board: [1,0,0,0,0,0,0,0,0]})
            game.moves.push({board: [1,-1,0,0,0,0,0,0,0]})
            game.moves.push({board: [1,-1,1,0,0,0,0,0,0]})
            game.moves.push({board: [1,-1,1,0,-1,0,0,0,0]})
            game.moves.push({board: [1,-1,1,0,-1,1,0,0,0]})
            game.moves.push({board: [1,-1,1,-1,-1,1,0,0,0]})
            game.moves.push({board: [1,-1,1,-1,-1,1,0,1,0]})
            game.moves.push({board: [1,-1,1,-1,-1,1,0,1,-1]})
            game.nextMove = 1
            game.save()
            
            const { statusCode, body } = await request.post(`/api/games/${game.id}/move`)
            .send({
                "board": [1, -1, 1, -1, -1, 1, 1, 1, -1]
            })

            const updatedGame = await Game.findById(body._id)

            expect(updatedGame).toBeTruthy()
            expect(statusCode).toBe(200)

            // Validate game data
            expect(updatedGame?.nextMove).toEqual(-1)
            expect(updatedGame?.result).toEqual(0)    
        })
    })

    // Get Game
    describe('Get Games', () => {
        it('should return all the existing games', async () => {

            const { statusCode, body } = await request.get(`/api/games`)

            expect(body.length).toEqual(4)
            expect(statusCode).toBe(200)

        })
    })

    // Get Games
    describe('Get Game', () => {
        it('should return all the existing games', async () => {

            const { statusCode, body } = await request.get(`/api/games/${gameId}`)

            expect(body._id).toBeTruthy()
            expect(statusCode).toBe(200)

        })
    })
})
