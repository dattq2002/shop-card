import { ObjectId } from 'mongodb'
import { OrderStatus } from '~/constants/enums'
import { getCurrentDate } from '~/utils/commons'

export interface IProductOrder {
  _id: string
  quantity: number
}

interface IOrder {
  _id?: ObjectId
  userId: ObjectId
  products: IProductOrder[]
  total: number
  status?: string
  created_at?: string
  updated_at?: string
}

export class Order {
  _id: ObjectId
  userId: ObjectId
  products: IProductOrder[]
  total: number
  status: string
  created_at: string
  updated_at: string
  constructor({ _id, userId, products, total, status, created_at, updated_at }: IOrder) {
    this._id = _id || new ObjectId()
    this.userId = userId
    this.products = products
    this.total = total
    this.status = status || OrderStatus.Pending
    this.created_at = created_at || getCurrentDate()
    this.updated_at = updated_at || getCurrentDate()
  }
}
