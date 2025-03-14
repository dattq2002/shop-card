import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { CATEGORIES_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/errors'
import { avatarSchema, nameSchema } from '~/models/paramSchema'
import { validate } from '~/utils/validation'

export const createCategoryValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      avatar: avatarSchema,
      discount_percent: {
        optional: true,
        isNumeric: {
          errorMessage: CATEGORIES_MESSAGES.DISCOUNT_PERCENT_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0 || value > 100) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: CATEGORIES_MESSAGES.DISCOUNT_PERCENT_MUST_BE_FROM_0_TO_100
              })
            }
            return true
          }
        }
      },
      price: {
        notEmpty: {
          errorMessage: CATEGORIES_MESSAGES.PRICE_IS_REQUIRED
        },
        isNumeric: {
          errorMessage: CATEGORIES_MESSAGES.PRICE_MUST_BE_A_NUMBER
        }
      }
    },
    ['body']
  )
)
export const updateCategoryValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 50
          },
          errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_50
        }
      },
      avatar: avatarSchema,
      discount_percent: {
        optional: true,
        isNumeric: {
          errorMessage: CATEGORIES_MESSAGES.DISCOUNT_PERCENT_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0 || value > 100) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: CATEGORIES_MESSAGES.DISCOUNT_PERCENT_MUST_BE_FROM_0_TO_100
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
