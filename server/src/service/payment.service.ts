import axios from 'axios'
import { HmacSHA256 } from 'crypto-js'
import moment from 'moment-timezone'
import { PaymentMethod } from '~/constants/enums'
import databaseService from '~/database/config.database'
import { Order } from '~/models/schemas/order.schema'
import { Payment } from '~/models/schemas/payment.schema'
import { safeStringify } from '~/utils/commons'
import * as qs from 'qs'

interface OrderRequest {
  app_id: string
  app_trans_id: string
  app_user: string
  app_time: number
  item: string
  embed_data: string
  amount: number
  description: string
  bank_code: string
  mac: string
}

class PaymentService {
  async processPayment(order: Order, paymentMethod: PaymentMethod) {
    await databaseService.payments.insertOne(
      new Payment({
        amount: order.total,
        payment_method: paymentMethod,
        order_id: order._id
      })
    )

    if (paymentMethod === PaymentMethod.ZALOPAY) {
      const config = {
        app_id: '2554',
        key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
        key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
        endpoint: 'https://sb-openapi.zalopay.vn/v2/create'
      }

      const items = order.products
      const embedData = {
        redirecturl: 'http://localhost:3000/payment/callback'
      }
      const transID = Math.floor(Math.random() * 1000000)
      const order_request: OrderRequest = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: 'user123',
        app_time: Date.now(),
        item: JSON.stringify(order.products),
        embed_data: JSON.stringify({ extra_info: 'test' }),
        amount: 50000,
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: 'zalopayapp',
        mac: ''
      }

      const data =
        config.app_id +
        '|' +
        order_request.app_trans_id +
        '|' +
        order_request.app_user +
        '|' +
        order_request.amount +
        '|' +
        order_request.app_time +
        '|' +
        order_request.embed_data +
        '|' +
        order_request.item
      order_request.mac = HmacSHA256(data, config.key1).toString()
      console.log(order_request)
      console.log(data)
      const api = axios.create({
        baseURL: config.endpoint,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // Quan trọng khi gửi params trong body
        }
      })
      const result = await api.post('/', qs.stringify(order_request))
      return result.data
    }
    return await databaseService.payments.findOne({ order_id: order._id })
  }
}
const paymentService = new PaymentService()
export default paymentService
