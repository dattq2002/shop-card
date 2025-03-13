import { Router } from 'express'
import { RoleTypes } from '~/constants/enums'
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController
} from '~/controllers/category.controller'
import { accessTokenValidator, allowRole } from '~/middlewares/auth/auth.middleware'
import { PaginationValidator } from '~/middlewares/auth/pagination.middleware'
import { createCategoryValidator, updateCategoryValidator } from '~/middlewares/category.middleware'
import { wrapAsync } from '~/utils/handlers'

const categoryRouter = Router()

categoryRouter.post(
  '/',
  accessTokenValidator,
  allowRole([RoleTypes.Admin]),
  createCategoryValidator,
  wrapAsync(createCategoryController)
)
categoryRouter.put(
  '/:id',
  accessTokenValidator,
  allowRole([RoleTypes.Admin]),
  updateCategoryValidator,
  wrapAsync(updateCategoryController)
)
categoryRouter.get('/:id', wrapAsync(getCategoryByIdController))

categoryRouter.get('/', PaginationValidator, wrapAsync(getCategoriesController))

categoryRouter.delete('/:id', accessTokenValidator, allowRole([RoleTypes.Admin]), wrapAsync(deleteCategoryController))

export default categoryRouter
