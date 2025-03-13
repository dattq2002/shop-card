import { ObjectId } from 'mongodb'
import databaseService from '~/database/config.database'
import { UpdateMeReqBody } from '~/models/requests/user.request'
import { getCurrentDate } from '~/utils/commons'
import { hashPassword } from '~/utils/crypto'

class UserService {
  async getMe(user_id: string) {
    return await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })
  }
  async getAllUsers(page: number, size: number) {
    const skip = (page - 1) * size
    const total = await databaseService.users.countDocuments()
    const users = await databaseService.users.find().skip(skip).limit(size).toArray()
    return {
      size,
      page,
      total,
      users
    }
  }
  async updateUser(user_id: string, reqBody: UpdateMeReqBody) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new Error('User not found')
    }
    let { name, avatar, password } = reqBody
    if (password) {
      password = hashPassword(password)
    }
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          name: name || user.name,
          avatar: avatar || user.avatar,
          password: password || user.password,
          update_date: getCurrentDate()
        }
      }
    )
    return await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  }
}
const userService = new UserService()
export default userService
