import { ObjectId } from 'mongodb'
import { getCurrentDate } from '~/utils/commons'

interface RefreshTokenType {
  _id?: ObjectId
  token: string
  created_at?: string
  user_id: ObjectId
  exp: number
  iat: number
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  created_at: string
  user_id: ObjectId
  exp: Date
  iat: Date
  constructor({ _id, token, created_at, user_id, exp, iat }: RefreshTokenType) {
    this._id = _id
    this.token = token
    this.created_at = created_at || getCurrentDate()
    this.user_id = user_id
    this.exp = new Date(exp * 1000)
    this.iat = new Date(iat * 1000)
  }
}
