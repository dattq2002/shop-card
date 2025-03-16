import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseAny } from '~/models/other'
import { ProductRequest } from '~/models/requests/product.request'
import { TokenPayload } from '~/models/requests/user.request'
import productService from '~/service/product.service'

export const createProductController = async (req: Request<ParamsDictionary, any, ProductRequest>, res: Response) => {
  const decoded_authorization = req.decoded_authorization as TokenPayload
  const result = await productService.createProduct({ payload: req.body, user_id: decoded_authorization.user_id })
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: 'Product created successfully',
      data: result
    })
  )
}

export const deleteProductController = async (req: Request, res: Response) => {
  const result = await productService.deleteProduct(req.params.id)
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: 'Product deleted successfully',
      data: result
    })
  )
}

export const getAllProductController = async (req: Request, res: Response) => {
  const { page, size } = req.query
  const result = await productService.getAllProduct(Number(page), Number(size))
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: 'Get all product successfully',
      data: result
    })
  )
}
export const getProductByUserIdController = async (req: Request, res: Response) => {
  const result = await productService.getProductByUserId(req.params.user_id)
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: 'Get product by user id successfully',
      data: result
    })
  )
}

export const getProductByOrderIdController = async (req: Request, res: Response) => {
  const result = await productService.getProductByOrderId(req.params.order_id)
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: 'Get product by order id successfully',
      data: result
    })
  )
}
