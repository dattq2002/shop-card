import { ObjectId } from 'mongodb'

interface ITransaction {
  _id?: ObjectId
  order_id: ObjectId
  payment_id: ObjectId
  amount: number
  status?: string
  create_date?: string
  update_date?: string
}

export class Transaction {
  _id: ObjectId
  order_id: ObjectId
  payment_id: ObjectId
  amount: number
  status: string
  create_date: string
  update_date: string
  constructor(transaction: ITransaction) {
    this._id = transaction._id || new ObjectId()
    this.order_id = transaction.order_id
    this.payment_id = transaction.payment_id
    this.amount = transaction.amount
    this.status = transaction.status || 'Pending'
    this.create_date = transaction.create_date || ''
    this.update_date = transaction.update_date || ''
  }
}
