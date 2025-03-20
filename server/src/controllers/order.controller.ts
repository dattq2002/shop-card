import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseAny } from '~/models/other'
import { OrderRequest } from '~/models/requests/order.request'
import { TokenPayload } from '~/models/requests/user.request'
import orderService from '~/service/order.service'

export const createOrderController = async (
  req: Request<ParamsDictionary, any, OrderRequest>,
  res: Response,
  next: NextFunction
) => {
  const decoded_authorization = req.decoded_authorization as TokenPayload
  const result = await orderService.createOrder(req.body, decoded_authorization.user_id)
  if (result) {
    req.order = result
    return next()
  }
  throw new Error('Error at createOrderController')
}

export const getOrderByIdController = async (req: Request, res: Response) => {
  const result = await orderService.getOrderById(req.params.id)
  if (result) {
    return void res.json(
      new ResponseAny({
        status: res.statusCode,
        message: 'Get order by id success',
        data: result
      })
    )
  }
}

export const getOrderAllController = async (req: Request, res: Response) => {
  const { page, size } = req.query
  const result = await orderService.getOrderAll(Number(page), Number(size))
  if (result) {
    return void res.json(
      new ResponseAny({
        status: res.statusCode,
        message: 'Get all order success',
        data: result
      })
    )
  }
}

export const updateOrderController = async (req: Request<ParamsDictionary, any, OrderRequest>, res: Response) => {
  const decoded_authorization = req.decoded_authorization as TokenPayload
  const result = await orderService.updateOrder(req.params.id, req.body, decoded_authorization.user_id)
  if (result) {
    return void res.json(
      new ResponseAny({
        status: res.statusCode,
        message: 'Update order success',
        data: result
      })
    )
  }
}

export const cancelOrderController = async (req: Request, res: Response) => {
  const decoded_authorization = req.decoded_authorization as TokenPayload
  const result = await orderService.cancelOrder(req.params.id, decoded_authorization.user_id)
  if (result) {
    return void res.json(
      new ResponseAny({
        status: res.statusCode,
        message: 'Cancel order success',
        data: result
      })
    )
  }
}

export const confirmOrderController = async (req: Request, res: Response, next: NextFunction) => {
  const decoded_authorization = req.decoded_authorization as TokenPayload
  const result = await orderService.confirmOrder(
    req.params.id,
    decoded_authorization === undefined ? undefined : decoded_authorization.user_id
  )
  if (result) {
    req.order = result
    return next()
  }
  throw new Error('Error at confirmOrderController')
}

export const generateProductController = async (req: Request, res: Response) => {
  if (!req.order) {
    throw new Error('Error at generateProductController')
  }
  const result = await orderService.generateProduct(req.order)
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: 'Confirm Order success',
      data: result
    })
  )
}
