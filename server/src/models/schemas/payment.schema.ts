import { ObjectId } from 'mongodb'
import { PaymentMethod } from '~/constants/enums'
import { getCurrentDate } from '~/utils/commons'

interface IPayment {
  _id?: ObjectId
  order_id: ObjectId
  payment_method: PaymentMethod
  amount: number
  currency?: string
  status?: string
  create_date?: string
  update_date?: string
}

export class Payment {
  _id: ObjectId
  order_id: ObjectId
  payment_method: PaymentMethod
  amount: number
  currency: string
  status: string
  create_date: string
  update_date: string
  constructor(payment: IPayment) {
    this._id = payment._id || new ObjectId()
    this.order_id = payment.order_id
    this.payment_method = payment.payment_method
    this.amount = payment.amount
    this.currency = payment.currency || 'VND'
    this.status = payment.status || 'Pending'
    this.create_date = payment.create_date || getCurrentDate()
    this.update_date = payment.update_date || getCurrentDate()
  }
}
