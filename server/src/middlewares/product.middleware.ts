import { checkSchema } from 'express-validator'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const productValidator = validate(
  checkSchema(
    {
      category_id: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.CATEGORY_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: PRODUCTS_MESSAGES.CATEGORY_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: 'Category Id must be a valid MongoId'
        }
      },
      quantity: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.QUANTITY_IS_REQUIRED
        },
        isNumeric: {
          errorMessage: PRODUCTS_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
        },
        isInt: {
          errorMessage: PRODUCTS_MESSAGES.QUANTITY_MUST_BE_AN_INTEGER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error('Quantity must be greater than or equal to 0')
            }
            if (value > 100) {
              throw new Error('Quantity must be less than or equal to 100')
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
