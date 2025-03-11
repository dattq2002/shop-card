import { Request, Response } from 'express'
import { LoginReqBody, RegisterReqBody, TokenPayload } from '~/models/requests/user.request'
import { ParamsDictionary } from 'express-serve-static-core'
import authService from '~/service/auth.service'
import { USERS_MESSAGES } from '~/constants/messages'
import User from '~/models/schemas/user.schema'
import { UserVerifyStatus } from '~/constants/enums'
import { hashPassword } from '~/utils/crypto'
import userService from '~/service/user.service'
import { ObjectId } from 'mongodb'
import { ResponseAny } from '~/models/other'
import HTTP_STATUS from '~/constants/httpStatus'

export const RegisterController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const data = await authService.register(req.body)
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      data
    })
  )
}

export const EmailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = req.user as User
  if (user.verify === UserVerifyStatus.Verified && user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await authService.verifyEmail(user_id)
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
      data: result
    })
  )
}

export const LoginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const { email, password } = req.body
  if (user.password !== hashPassword(password)) {
    return void res.json({
      status: res.statusCode,
      message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT
    })
  }
  if (user.verify === UserVerifyStatus.Banned) {
    return void res.json({
      status: res.statusCode,
      message: USERS_MESSAGES.USER_BANNED
    })
  }
  if (user.verify !== UserVerifyStatus.Verified) {
    return void res.json({
      status: res.statusCode,
      message: USERS_MESSAGES.EMAIL_NOT_VERIFIED
    })
  }
  const data = await authService.login(user._id)
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      data
    })
  )
}

export const RefreshTokenController = async (req: Request, res: Response) => {
  const decoded_refresh_token = req.decoded_refresh_token as TokenPayload
  const user = await userService.getMe(decoded_refresh_token.user_id)
  if (!user) {
    return void res.json({
      status: res.statusCode,
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Banned) {
    return void res.json({
      status: res.statusCode,
      message: USERS_MESSAGES.USER_BANNED
    })
  }
  if (user.verify !== UserVerifyStatus.Verified) {
    return void res.json({
      status: res.statusCode,
      message: USERS_MESSAGES.EMAIL_NOT_VERIFIED
    })
  }
  const data = await authService.refreshToken(new ObjectId(user._id))
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: USERS_MESSAGES.RE_PROVIDE_TOKEN_SUCCESS,
      data
    })
  )
}

export const LogoutController = async (req: Request, res: Response) => {
  const decoded_authorization = req.decoded_authorization as TokenPayload
  const result = await authService.logout(decoded_authorization.user_id)
  return result
    ? void res.json(
        new ResponseAny({
          status: res.statusCode,
          message: USERS_MESSAGES.LOGOUT_SUCCESS,
          data: result
        })
      )
    : void res.json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: USERS_MESSAGES.LOGOUT_FAIL
      })
}

export const ResendEmailVerifyController = async (req: Request, res: Response) => {
  const user = req.user as User
  const result = await authService.resendEmailVerify(user)
  return void res.json(
    new ResponseAny({
      status: res.statusCode,
      message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS,
      data: result
    })
  )
}
