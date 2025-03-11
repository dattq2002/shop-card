import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const PaginationValidator = validate(
  checkSchema(
    {
      page: {
        isNumeric: {
          errorMessage: 'Page must be a number'
        }
      },
      size: {
        isNumeric: {
          errorMessage: 'Size must be a number'
        }
      }
    },
    ['query']
  )
)
