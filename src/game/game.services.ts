import { FilterQuery } from "mongoose"
import Game from "./game.model"
import { GameDocument, GameInput, MoveDocument, moveItem, player } from "./game.types"

/*** Public Services ***/

// Create Game
export const createGame = async () => {
    try{
        // Create Initial Move (Starting Board)
        // Add Initial result
        // Add Initial nextMove
        const initalGame:GameInput = {
            nextMove: 1,
            result: -2,
            moves: [
                {
                    board: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            ]
        }
        return await Game.create(initalGame)
    }catch(e:any){
        throw new Error(e)
    }
}

// Make a move
export const makeMove =async (
    query: FilterQuery<GameDocument>,
    move: MoveDocument
) => {
    try{
        // Get the Game Record
        const game = await Game.findOne(query)
        if(!game) throw new Error('Game Id is invalid')
        // If the game is over then no moves are allowed
        if(game.result !== -2) throw new Error('The game is over, No more moves allowed')
        // Validate Move
        validateMove(move, game.moves[game.moves.length - 1], game.nextMove)
        // Add the move to moves
        game.moves.push(move)
        // Update the result
        game.result = checkResult(move, game.nextMove)
        // Update the nextMove
        game.nextMove === 1 ? game.nextMove = -1 : game.nextMove = 1
        // Save
        return await game.save()
    }catch(e:any){
        throw new Error(e)
    }
}

// Get Game
export const getGame =async (
    query: FilterQuery<GameDocument>,
) => {
    try{
        return await Game.findOne(query)
    }catch(e:any){
        throw new Error(e)
    }
}

// Get Games
export const getGames =async () => {
    try{
        return await Game.find()
    }catch(e:any){
        throw new Error(e)
    }
}

/*** Private Services ***/
// Consts
const WINNING_COMBINATION = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

// Validate Move
const validateMove = (currMove:MoveDocument, prevMove:MoveDocument, nextMove:player) => {
    const key = {
        1: 0,
        0: 0,
        "-1": 0
    }

    const diff = currMove.board.map((item:moveItem, index:number) => {
        const diffItem = item - prevMove.board[index]
        if (diffItem === 1) return 1
        if (diffItem === -1) return -1
        return 0
    })

    diff.forEach((item) => {
        ++key[item]
    })

    // Same move cannot be entered twice
    if(key[0] === 9 ) throw new Error('Make a move first')
    // Should not be able to make more than 1 change
    if(key[1] > 1 || key[-1] > 1 || (key[1] === 1 && key[-1] === 1)) throw new Error('You can only make a single move at a time')
    // If nextMove = 1 then change should be 1
    if(nextMove === 1 && key[-1] === 1) throw new Error('Its the turn of the player 1')
    // If nextMove = -1 then change should be -1
    if(nextMove === -1 && key[1] === 1) throw new Error('Its the turn of the player 2')
}

// Check Result
const checkResult = (move: MoveDocument, nextMove:Number) => {
    // Check if there is a winner
    const hasResult = WINNING_COMBINATION.some(combination => {
        return combination.every(index => {
            return move.board[index] === nextMove
        })
    })

    if(hasResult) {
        if(nextMove === 1) return 1
        if(nextMove === -1) return -1
    }

    const isDraw = move.board.every((item) => item !== 0)
    if(isDraw) return 0

    return -2
}