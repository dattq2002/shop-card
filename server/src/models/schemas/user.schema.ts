import { ObjectId } from 'mongodb'
import { RoleTypes, UserVerifyStatus } from '~/constants/enums'

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
  create_date?: Date
  update_date?: Date
}

export default class User {
  _id: ObjectId
  name: string
  email: string
  password: string
  role: string
  avatar: string
  create_date: Date
  update_date: Date
  flag: boolean
  email_verify_token: string
  verify: UserVerifyStatus
  constructor(user: UserTypes) {
    this._id = new ObjectId()
    this.name = user.name || ''
    this.email = user.email || ''
    this.password = user.password || ''
    this.role = user.role || RoleTypes.Customer
    this.avatar = user.avatar || ''
    this.create_date = user.create_date || new Date()
    this.update_date = user.update_date || new Date()
    this.flag = user.flag || false
    this.email_verify_token = user.email_verify_token || ''
    this.verify = user.verify
  }
}
