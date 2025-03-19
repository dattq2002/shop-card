import { ObjectId } from 'mongodb'
import { RoleTypes, UserVerifyStatus } from '~/constants/enums'
import { getCurrentDate } from '~/utils/commons'

interface UserTypes {
  _id?: ObjectId
  name?: string
  email?: string
  password?: string
  role?: string
  avatar?: string
  flag?: boolean
  email_verify_token?: string
  verify: UserVerifyStatus
  create_date?: string
  update_date?: string
  balance?: number
}

export default class User {
  _id: ObjectId
  name: string
  email: string
  password: string
  role: string
  avatar: string
  create_date: string
  update_date: string
  flag: boolean
  email_verify_token: string
  verify: UserVerifyStatus
  balance: number
  constructor(user: UserTypes) {
    this._id = new ObjectId()
    this.name = user.name || ''
    this.email = user.email || ''
    this.password = user.password || ''
    this.role = user.role || RoleTypes.Customer
    this.avatar = user.avatar || ''
    this.create_date = user.create_date || getCurrentDate()
    this.update_date = user.update_date || getCurrentDate()
    this.flag = user.flag || false
    this.email_verify_token = user.email_verify_token || ''
    this.verify = user.verify
    this.balance = user.balance || 0
  }
}
