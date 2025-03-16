import { checkSchema } from 'express-validator'
import { ORDER_MESSAGES } from '~/constants/messages'
import { IProductOrder } from '~/models/schemas/order.schema'
import { validate } from '~/utils/validation'

export const orderValidator = validate(
  checkSchema(
    {
      products: {
        notEmpty: {
          errorMessage: ORDER_MESSAGES.NOT_EMPTY_PRODUCTS
        },
        isArray: {
          errorMessage: ORDER_MESSAGES.INVALID_PRODUCTS
        },
        custom: {
          options: (products: IProductOrder[]) => products.every((product) => product._id && product.quantity),
          errorMessage: ORDER_MESSAGES.INVALID_PRODUCTS
        }
      },
      total: {
        notEmpty: {
          errorMessage: ORDER_MESSAGES.NOT_EMPTY_TOTAL
        },
        isNumeric: {
          errorMessage: ORDER_MESSAGES.INVALID_TOTAL
        },
        isInt: {
          errorMessage: ORDER_MESSAGES.INVALID_TOTAL_INT
        }
      }
    },
    ['body']
  )
)
