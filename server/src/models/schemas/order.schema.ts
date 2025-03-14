import { OrderStatus } from '~/constants/enums'

interface IProductOrder {
  _id: string
  quantity: number
}

interface IOrder {
  _id: string
  userId: string
  products: IProductOrder[]
  total: number
  status?: string
  created_at?: Date
  updated_at?: Date
}

export class Order {
  _id: string
  userId: string
  products: IProductOrder[]
  total: number
  status: string
  created_at: Date
  updated_at: Date
  constructor({ _id, userId, products, total, status, created_at, updated_at }: IOrder) {
    this._id = _id
    this.userId = userId
    this.products = products
    this.total = total
    this.status = status || OrderStatus.Pending
    this.created_at = created_at || new Date()
    this.updated_at = updated_at || new Date()
  }
}
