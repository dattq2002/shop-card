import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import databaseService from '~/database/config.database'
import { ErrorWithStatus } from '~/models/errors'
import { CategoryReq } from '~/models/requests/category.request'
import { Category } from '~/models/schemas/product.schema'
import { getCurrentDate } from '~/utils/commons'

class CategoryService {
  async createCategory(payload: CategoryReq) {
    const newCategory = await databaseService.categories.insertOne(
      new Category({
        ...payload
      })
    )
    const category = await databaseService.categories.findOne({ _id: newCategory.insertedId })
    return category
  }
  async updateCategory(id: string, payload: CategoryReq) {
    const category = await databaseService.categories.findOne({ _id: new ObjectId(id) })
    if (!category) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: 'Category not found'
      })
    }
    await databaseService.categories.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: payload.name || category.name,
          avatar: payload.avatar || category.avatar,
          discount_percent: payload.discount_percent || category.discount_percent,
          updated_at: getCurrentDate()
        }
      }
    )
    return await databaseService.categories.findOne({ _id: new ObjectId(id) })
  }
  async getCategoryById(id: string) {
    const category = await databaseService.categories.findOne({ _id: new ObjectId(id) })
    return category
  }
  async getAllCategories(page: number, size: number) {
    const total = await databaseService.categories.countDocuments()
    const categories = await databaseService.categories
      .find()
      .skip((page - 1) * size)
      .limit(size)
      .toArray()
    return {
      size,
      page,
      total,
      categories
    }
  }
  async deleteCategory(id: string) {
    await databaseService.categories.deleteOne({ _id: new ObjectId(id) })
    return { id }
  }
}

const categoryService = new CategoryService()
export default categoryService
