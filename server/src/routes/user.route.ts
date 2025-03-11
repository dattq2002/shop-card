import { Router } from 'express'
import { getAllUsersController, GetMeController, GetUserByIdController } from '~/controllers/user.controller'
import { accessTokenValidator } from '~/middlewares/auth/auth.middleware'
import { wrapAsync } from '~/utils/handlers'

const userRouter = Router()

userRouter.get('/me', accessTokenValidator, wrapAsync(GetMeController))

userRouter.get('/:id', wrapAsync(GetUserByIdController))

userRouter.get('/', wrapAsync(getAllUsersController))

export default userRouter
