import { Request, Response } from 'express'
import { USERS_MESSAGES } from '~/constants/messages'
import { TokenPayload, UpdateMeReqBody } from '~/models/requests/user.request'
import userService from '~/service/user.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseGeneric } from '~/models/other'
import User from '~/models/schemas/user.schema'

export const GetMeController = async (req: Request, res: Response) => {
  const decoded_authorization = req.decoded_authorization as TokenPayload
  const result = await userService.getMe(decoded_authorization.user_id)
  return void res.json({
    status: res.statusCode,
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    data: result
  })
}
export const GetUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await userService.getMe(id)
  return void res.json({
    status: res.statusCode,
    message: USERS_MESSAGES.GET_USER_BY_ID_SUCCESS,
    data: result
  })
}

export const getAllUsersController = async (req: Request, res: Response) => {
  const { page, size } = req.query
  // console.log(page, size)
  const result = await userService.getAllUsers(Number(page), Number(size))
  return void res.json({
    status: res.statusCode,
    message: USERS_MESSAGES.GET_ALL_USERS_SUCCESS,
    data: result
  })
}

export const updateUserController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
  const { avatar, name, password } = req.body
  const decoded_authorization = req.decoded_authorization as TokenPayload
  const data = await userService.updateUser(decoded_authorization.user_id, { avatar, name, password })
  return void res.json(
    new ResponseGeneric<User>({
      status: res.statusCode,
      message: USERS_MESSAGES.UPDATE_USER_SUCCESS,
      data
    })
  )
}
