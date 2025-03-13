import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
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
          errorMessage: 'Discount percent must be a number'
        },
        custom: {
          options: (value) => {
            if (value < 0 || value > 100) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'Discount percent must be from 0 to 100'
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
export const updateCategoryValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: {
          errorMessage: 'Name must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 50
          },
          errorMessage: 'Name length must be from 1 to 50'
        }
      },
      avatar: avatarSchema,
      discount_percent: {
        optional: true,
        isNumeric: {
          errorMessage: 'Discount percent must be a number'
        },
        custom: {
          options: (value) => {
            if (value < 0 || value > 100) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'Discount percent must be from 0 to 100'
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
