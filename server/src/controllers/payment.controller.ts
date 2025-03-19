import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseAny } from '~/models/other'
import { OrderRequest } from '~/models/requests/order.request'
import { Order } from '~/models/schemas/order.schema'
import paymentService from '~/service/payment.service'

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
