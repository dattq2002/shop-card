import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseAny, ResponseGeneric } from '~/models/other'
import { CategoryReq } from '~/models/requests/category.request'
import { Category } from '~/models/schemas/product.schema'
import categoryService from '~/service/category.service'

export const createCategoryController = async (req: Request<ParamsDictionary, any, CategoryReq>, res: Response) => {
  const data = await categoryService.createCategory(req.body)
  return void res.json(
    new ResponseGeneric<Category>({
      status: res.statusCode,
      message: 'Create category successfully',
      data
    })
  )
}

export const updateCategoryController = async (req: Request<ParamsDictionary, any, CategoryReq>, res: Response) => {
  const data = await categoryService.updateCategory(req.params.id, req.body)
  return void res.json(
    new ResponseGeneric<Category>({
      status: res.statusCode,
      message: 'Update category successfully',
      data
    })
  )
}

export const getCategoryByIdController = async (req: Request, res: Response) => {
  const data = await categoryService.getCategoryById(req.params.id)
  return void res.json(
    new ResponseGeneric<Category>({
      status: res.statusCode,
      message: 'Get category successfully',
      data
    })
  )
}

export const getCategoriesController = async (req: Request, res: Response) => {
  const { page, size } = req.query
  const data = await categoryService.getAllCategories(Number(page), Number(size))
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: 'Get categories successfully',
      data
    })
  )
}

export const deleteCategoryController = async (req: Request, res: Response) => {
  const data = await categoryService.deleteCategory(req.params.id)
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: 'Delete category successfully',
      data
    })
  )
}
