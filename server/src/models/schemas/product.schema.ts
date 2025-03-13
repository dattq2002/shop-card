import { ObjectId } from 'mongodb'
import { getCurrentDate } from '~/utils/commons'

interface ICategory {
  _id?: ObjectId
  name?: string
  avatar?: string
  discount_percent?: number
  created_at?: string
  updated_at?: string
}
export class Category {
  _id: ObjectId
  name: string
  avatar: string
  discount_percent: number
  created_at: string
  updated_at: string
  constructor(category: ICategory) {
    this._id = category._id || new ObjectId()
    this.name = category.name || ''
    this.avatar = category.avatar || ''
    this.discount_percent = category.discount_percent || 0
    this.created_at = category.created_at || getCurrentDate()
    this.updated_at = category.updated_at || getCurrentDate()
  }
}

interface IProduct {
  _id?: ObjectId
  name?: string
  category_id?: ObjectId
  price?: number
  created_at?: string
  updated_at?: string
}

export class Product {
  _id: ObjectId
  name: string
  type_id: ObjectId
  price: number
  created_at: string
  updated_at: string
  constructor(product: IProduct) {
    this._id = product._id || new ObjectId()
    this.name = product.name || ''
    this.type_id = product.category_id || new ObjectId()
    this.price = product.price || 0
    this.created_at = product.created_at || getCurrentDate()
    this.updated_at = product.updated_at || getCurrentDate()
  }
}
