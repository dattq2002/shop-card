import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const PaginationValidator = validate(
  checkSchema(
    {
      page: {
        optional: true,
        isNumeric: {
          errorMessage: 'Page must be a number'
        }
      },
      size: {
        optional: true,
        isNumeric: {
          errorMessage: 'Size must be a number'
        }
      }
    },
    ['query']
  )
)
