import { Router } from 'express'
import {
  EmailVerifyController,
  LoginController,
  RefreshTokenController,
  RegisterController
} from '~/controllers/auth.controller'
import {
  emailVerifyTokenValidator,
  LoginValidator,
  refreshTokenValidator,
  RegisterValidator
} from '~/middlewares/auth/auth.middleware'
import { wrapAsync } from '~/utils/handlers'

const authRouter = Router()

authRouter.post('/register', RegisterValidator, wrapAsync(RegisterController))

authRouter.get('/verify-email/:token', emailVerifyTokenValidator, wrapAsync(EmailVerifyController as any))

authRouter.post('/login', LoginValidator, wrapAsync(LoginController))

authRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(RefreshTokenController))

export default authRouter
