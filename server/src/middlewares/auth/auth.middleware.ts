import { checkSchema, ParamSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/database/config.database'
import { ErrorWithStatus } from '~/models/errors'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import authService from '~/service/auth.service'
import { passwordSchema, confirmPasswordSchema, emailSchema } from '~/models/paramSchema'
import { TokenPayload } from '~/models/requests/user.request'

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
              // console.log(user_id)
              const user = await databaseService.users.findOne({
                _id: new ObjectId(user_id)
              })
              if (!user) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USER_NOT_FOUND,
                  status: HTTP_STATUS.NOT_FOUND
                })
              }
              if (user.email_verify_token !== value) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_NOT_MATCH,
                  status: HTTP_STATUS.UNAUTHORIZED
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
      email: emailSchema,
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
              const refresh_token = await databaseService.refreshTokens.findOne({
                user_id: new ObjectId(decoded_authorization.user_id)
              })
              if (!refresh_token) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.YOU_HAVE_NOT_LOGGED_IN,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
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
export const emailValidator = validate(
  checkSchema(
    {
      email: emailSchema
    },
    ['body']
  )
)

export const allowRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const decoded_authorization = req.decoded_authorization as TokenPayload
    const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_authorization.user_id) })
    if (!user) {
      return void res.json({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.USER_NOT_FOUND
      })
    }
    if (roles.includes(user.role)) {
      req.user = user
      return next()
    }
    return void res.json({
      status: HTTP_STATUS.FORBIDDEN,
      message: AUTH_MESSAGES.YOU_DO_NOT_PERMISSION_TO_ACCESS
    })
  }
}
