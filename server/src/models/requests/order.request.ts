import { IProductOrder } from '~/models/schemas/order.schema'

export interface OrderRequest {
  products: IProductOrder[]
  total: number
}
