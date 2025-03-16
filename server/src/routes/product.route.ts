import { Router } from 'express'
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getProductByOrderIdController,
  getProductByUserIdController
} from '~/controllers/product.controller'
import { accessTokenValidator } from '~/middlewares/auth/auth.middleware'
import { PaginationValidator } from '~/middlewares/auth/pagination.middleware'
import { productValidator } from '~/middlewares/product.middleware'
import { wrapAsync } from '~/utils/handlers'

const productRouter = Router()

productRouter.post('/', accessTokenValidator, productValidator, wrapAsync(createProductController))

productRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteProductController))

productRouter.get('/', accessTokenValidator, PaginationValidator, wrapAsync(getAllProductController))

productRouter.get('/user/:user_id', accessTokenValidator, wrapAsync(getProductByUserIdController))

productRouter.get('/order/:order_id', accessTokenValidator, wrapAsync(getProductByOrderIdController))
export default productRouter
