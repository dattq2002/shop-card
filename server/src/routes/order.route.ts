import { Router } from 'express'
import {
  cancelOrderController,
  confirmOrderController,
  createOrderController,
  generateProductController,
  getOrderAllController,
  getOrderByIdController,
  updateOrderController
} from '~/controllers/order.controller'
import { paymentController } from '~/controllers/payment.controller'
import { accessTokenValidator } from '~/middlewares/auth/auth.middleware'
import { PaginationValidator } from '~/middlewares/auth/pagination.middleware'
import { orderValidator } from '~/middlewares/order.middleware'
import { wrapAsync } from '~/utils/handlers'

const orderRouter = Router()

orderRouter.post(
  '/',
  accessTokenValidator,
  orderValidator,
  wrapAsync(createOrderController),
  wrapAsync(paymentController)
)

orderRouter.get('/:id', accessTokenValidator, wrapAsync(getOrderByIdController))

orderRouter.get('/', accessTokenValidator, PaginationValidator, wrapAsync(getOrderAllController))

orderRouter.put('/:id', accessTokenValidator, orderValidator, wrapAsync(updateOrderController))

orderRouter.delete('/:id', accessTokenValidator, wrapAsync(cancelOrderController))

orderRouter.get(
  '/confirm/:id',
  accessTokenValidator,
  wrapAsync(confirmOrderController),
  wrapAsync(generateProductController)
)
orderRouter.get('/confirm-online/:id', wrapAsync(confirmOrderController), wrapAsync(generateProductController))

export default orderRouter
