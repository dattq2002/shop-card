import { ObjectId } from 'mongodb'
import { getCurrentDate } from '~/utils/commons'

interface ICategory {
  _id?: ObjectId
  name?: string
  avatar?: string
  discount_percent?: number
  price?: number
  created_at?: string
  updated_at?: string
}
export class Category {
  _id: ObjectId
  name: string
  avatar: string
  discount_percent: number
  price: number
  created_at: string
  updated_at: string
  constructor(category: ICategory) {
    this._id = category._id || new ObjectId()
    this.name = category.name || ''
    this.avatar = category.avatar || ''
    this.discount_percent = category.discount_percent || 0
    this.created_at = category.created_at || getCurrentDate()
    this.updated_at = category.updated_at || getCurrentDate()
    this.price = category.price || 0
  }
}

interface IProduct {
  _id?: ObjectId
  seri?: string
  code?: string
  category_id?: ObjectId
  isUsed?: boolean
  user_id?: ObjectId
  order_id?: ObjectId
  created_at?: string
  updated_at?: string
}

export class Product {
  _id: ObjectId
  seri: string
  code: string
  category_id: ObjectId
  isUsed: boolean
  user_id: ObjectId
  order_id: ObjectId
  created_at: string
  updated_at: string
  constructor(product: IProduct) {
    this._id = product._id || new ObjectId()
    this.category_id = product.category_id || new ObjectId()
    this.created_at = product.created_at || getCurrentDate()
    this.updated_at = product.updated_at || getCurrentDate()
    this.seri = product.seri || ''
    this.code = product.code || ''
    this.isUsed = product.isUsed || false
    this.user_id = product.user_id || new ObjectId()
    this.order_id = product.order_id || new ObjectId()
  }
}
