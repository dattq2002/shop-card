import { ObjectId } from 'mongodb'
import databaseService from '~/database/config.database'

class UserService {
  async getMe(user_id: string) {
    return await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })
  }
  async getAllUsers(page: number, size: number) {
    return await databaseService.users.find({})
  }
}
const userService = new UserService()
export default userService
