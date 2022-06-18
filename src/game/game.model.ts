import mongoose from "mongoose"
import { GameDocument, MoveDocument } from "./game.types"

export const moveSchema = new mongoose.Schema<MoveDocument>({
    board: [Number]
})

export const gameSchema = new mongoose.Schema<GameDocument>({
    nextMove: Number,
    result: Number,
    moves: [moveSchema]
},{
    timestamps: true
})

const Game = mongoose.model<GameDocument>(`Game`, gameSchema)

export default Game