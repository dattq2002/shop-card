import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { ParamsDictionary } from 'express-serve-static-core'
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
}
export interface LoginReqBody {
  email: string
  password: string
}

export interface LogoutReqBody {
  refresh_token: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}
export interface VerifyEmailReqBody {
  email_verify_token: string
}
export interface ForgotPasswordReqBody {
  email: string
}
export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}
export interface ResetPasswordReqBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}
export interface UpdateMeReqBody {
  name?: string
  avatar?: string
  password?: string
}
//vì đây là route patch nên ngta truyền thiếu 1 trong các prop trên cũng k sao
export interface GetProfileReqParams extends ParamsDictionary {
  username: string
}
export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}
export interface RefreshTokenReqBody {
  refresh_token: string
}
