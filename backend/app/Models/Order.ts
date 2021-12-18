import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import Product from './Product'
import User from './User'

export default class Order extends BaseModel {
  public static selfAssignPrimaryKey = true
  @beforeCreate()
  public static assignUuid(product: Order) {
    product.id = uuid()
  }
  @column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public user_id: string
  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @column()
  public product_id: string
  @belongsTo(() => Product, { foreignKey: 'product_id' })
  public product: BelongsTo<typeof Product>

  // 订单中商品的数量
  @column()
  public quantity: number

  // 物流信息
  @column()
  public trans_status: string
}
