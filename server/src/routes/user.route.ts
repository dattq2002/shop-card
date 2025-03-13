import { Router } from 'express'
import { RoleTypes } from '~/constants/enums'
import {
  getAllUsersController,
  GetMeController,
  GetUserByIdController,
  updateUserController
} from '~/controllers/user.controller'
import { accessTokenValidator, allowRole } from '~/middlewares/auth/auth.middleware'
import { PaginationValidator } from '~/middlewares/auth/pagination.middleware'
import { updateUserValidator } from '~/middlewares/user.middleware'
import { wrapAsync } from '~/utils/handlers'

const userRouter = Router()

userRouter.get('/me', accessTokenValidator, wrapAsync(GetMeController))

userRouter.get('/:id', accessTokenValidator, wrapAsync(GetUserByIdController))

userRouter.get(
  '/',
  accessTokenValidator,
  allowRole([RoleTypes.Admin, RoleTypes.Customer]),
  PaginationValidator,
  wrapAsync(getAllUsersController)
)

userRouter.put('/:id', accessTokenValidator, updateUserValidator, wrapAsync(updateUserController))

export default userRouter
