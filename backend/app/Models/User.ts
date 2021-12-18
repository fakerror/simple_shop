import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Order from 'App/Models/Order'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

export default class User extends BaseModel {
  // 使用自定义的规则创建主键 而不使用数据库的
  public static selfAssignPrimaryKey = true
  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid()
  }
  @column({ isPrimary: true })
  public id: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Order, { foreignKey: 'user_id' })
  public orders: HasMany<typeof Order>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
