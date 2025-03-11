import { checkSchema, ParamSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/database/config.database'
import { ErrorWithStatus } from '~/models/errors'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import authService from '~/service/auth.service'

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
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
const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 8,
      max: 50
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
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
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
      }
      return true
    }
  }
}
export const RegisterValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
        }
      },
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const isExsit = await authService.checkEmailExists(value)
            if (isExsit) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              })
              ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
              const user_id = decoded_email_verify_token.user_id
              console.log(user_id)
              const user = await databaseService.users.findOne({
                _id: new ObjectId(user_id)
              })
              if (!user) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USER_NOT_FOUND,
                  status: HTTP_STATUS.NOT_FOUND
                })
              }
              req.user = user
              if (user.verify === UserVerifyStatus.Banned) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USER_BANNED,
                  status: HTTP_STATUS.FORBIDDEN
                })
              }
              if (user.verify != UserVerifyStatus.Verified && value !== user.email_verify_token) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_NOT_MATCH,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const LoginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const userExist = await databaseService.users.findOne({
              email: value
            })
            if (userExist) {
              req.user = userExist
              return true
            }
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.EMAIL_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
        }
      },
      password: passwordSchema
    },
    ['body']
  )
)
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const accessToken = value.split(' ')[1]
            if (!accessToken) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            //nếu xuống dc đây thì có nghĩa là có access token
            //cần verify access token và lấy payload() ra lưu lại trong req
            try {
              const decoded_authorization = await verifyToken({
                token: accessToken,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              //; quan trọng
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                databaseService.refreshTokens.findOne({
                  token: value
                })
              ])
              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
