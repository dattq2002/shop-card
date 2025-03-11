import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const updateUserValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: {
          errorMessage: 'Name must be a string'
        }
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: 'Avatar must be a string'
        }
      },
      password: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            // minLowercase: 1,
            // minUppercase: 1,
            // minNumbers: 1,
            // minSymbols: 1
            returnScore: true
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)
