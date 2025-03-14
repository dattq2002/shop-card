import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseAny } from '~/models/other'
import { ProductRequest } from '~/models/requests/product.request'
import productService from '~/service/product.service'

export const createProductController = async (req: Request<ParamsDictionary, any, ProductRequest>, res: Response) => {
  const result = await productService.createProduct(req.body)
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
