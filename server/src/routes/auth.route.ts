import { Router } from 'express'
import {
  EmailVerifyController,
  LoginController,
  LogoutController,
  RefreshTokenController,
  RegisterController,
  ResendEmailVerifyController
} from '~/controllers/auth.controller'
import {
  accessTokenValidator,
  emailValidator,
  emailVerifyTokenValidator,
  LoginValidator,
  refreshTokenValidator,
  RegisterValidator
} from '~/middlewares/auth/auth.middleware'
import { wrapAsync } from '~/utils/handlers'

const authRouter = Router()

authRouter.post('/register', RegisterValidator, wrapAsync(RegisterController))

authRouter.get('/verify-email/:token', emailVerifyTokenValidator, wrapAsync(EmailVerifyController as any))

authRouter.post('/resend-verify-email', emailValidator, wrapAsync(ResendEmailVerifyController))

authRouter.post('/login', LoginValidator, wrapAsync(LoginController))

authRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(RefreshTokenController))

authRouter.get('/logout', accessTokenValidator, wrapAsync(LogoutController))

export default authRouter
