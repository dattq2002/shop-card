import { HmacSHA256 } from 'crypto-js'
import { config } from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { split } from 'lodash'
import { ResponseAny } from '~/models/other'
import { OrderRequest } from '~/models/requests/order.request'
import { Order } from '~/models/schemas/order.schema'
import orderService from '~/service/order.service'
import paymentService from '~/service/payment.service'
import { OrderRequest_ZaloPay } from '~/utils/payment_online'
config()
export const paymentController = async (
  req: Request<ParamsDictionary, any, OrderRequest>,
  res: Response,
  next: NextFunction
) => {
  const order = req.order as Order
  const result = await paymentService.processPayment(order, req.body.payment_method)
  if (result) {
    return void res.json(new ResponseAny({ status: res.statusCode, message: 'Payment success', data: result }))
  }
}

export const zaloPaymentCallback = (req: Request, res: Response, next: NextFunction) => {
  let result = {
    return_code: 1,
    return_message: 'success'
  }

  try {
    let dataStr = req.body.data
    let reqMac = req.body.mac
    let mac = HmacSHA256(dataStr, process.env.ZALO_APP_SECRET_2 as string).toString()
    if (reqMac !== mac) {
      result.return_code = -1
      result.return_message = 'mac not equal'
    } else {
      let dataJson = JSON.parse(dataStr)
      console.log("update order's status = success where app_trans_id =", dataJson['app_trans_id'])
      result.return_code = 1
      result.return_message = 'success'
    }
  } catch (ex: any) {
    result.return_code = 0
    result.return_message = ex.message
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result)
}
