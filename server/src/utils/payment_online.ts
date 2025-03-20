import axios from 'axios'
import { HmacSHA256 } from 'crypto-js'
import { config } from 'dotenv'
import moment from 'moment-timezone'
import * as qs from 'qs'

config()
export interface OrderRequest_ZaloPay {
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
  expire_duration_seconds: number
  callback_url: string
  zp_trans_id?: number
  server_time?: number
  channel?: number
  merchant_user_id?: string
  zp_user_id?: string
  user_fee_amount?: number
  discount_amount?: number
}
export const paymentOnlineZaloPay = async ({
  items,
  embed_data,
  order_id,
  amount,
  user_id
}: {
  items: Object[]
  embed_data: Object
  order_id: string
  amount: number
  user_id: string
}) => {
  const config = {
    app_id: process.env.ZALO_APP_ID as string,
    key1: process.env.ZALO_APP_SECRET_1 as string,
    key2: process.env.ZALO_APP_SECRET_2 as string,
    endpoint: process.env.ZALO_ENDPOINT as string
  }
  const transID = order_id
  const order_request: OrderRequest_ZaloPay = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
    app_user: user_id,
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    description: `Shop Card - Payment for the order #${transID}`,
    bank_code: 'zalopayapp',
    mac: '',
    expire_duration_seconds: 1800,
    callback_url: 'https://bb49-2402-800-62a8-ef4c-893f-e8d2-93fe-7942.ngrok-free.app/callback'
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
