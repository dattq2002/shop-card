import { Request, Response } from 'express'
import { TokenPayload } from '~/models/requests/user.request'
import userService from '~/service/user.service'

export const GetMeController = async (req: Request, res: Response) => {
  const decoded_authorization = req.decoded_authorization as TokenPayload
  const result = await userService.getMe(decoded_authorization.user_id)
  return void res.json({
    status: res.statusCode,
    data: result
  })
}
export const GetUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await userService.getMe(id)
  return void res.json({
    status: res.statusCode,
    data: result
  })
}

export const getAllUsersController = async (req: Request, res: Response) => {
  const { page, size } = req.query
  const result = await userService.getAllUsers(Number(page), Number(size))
  return void res.json({
    status: res.statusCode,
    data: result
  })
}
