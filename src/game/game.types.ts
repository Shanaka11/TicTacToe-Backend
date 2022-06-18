import mongoose from "mongoose"
import { number, object, string, TypeOf, ZodEnum, ZodType } from "zod"

const params = {
    params: object({
        id: string()
    })
}

export type player = 1 | -1
export type moveItem = 0 | player
export type result = -2 | moveItem

export interface MoveDocument {
    board: moveItem[]
}

export interface GameInput  {
    nextMove: player,
    result: result,
    moves: MoveDocument[],
}

export interface GameDocument extends GameInput, mongoose.Document {
    createdAt: Date,
    updatedAt: Date
}

export const makeMoveSchema = object({
    body: object({
        board: number().gte(-1).lte(1).array().length(9)
    }),
    ...params
})

export const getGameScehma = object({
    ...params
})

export type MakeMoveInput = TypeOf<typeof makeMoveSchema>
export type GetGameInput = TypeOf<typeof getGameScehma>