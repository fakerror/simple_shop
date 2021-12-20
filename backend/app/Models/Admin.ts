import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeCreate, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

export default class Admin extends BaseModel {
  public static selfAssignPrimaryKey = true
  @beforeCreate()
  public static assignUuid(user: Admin) {
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

  @beforeSave()
  public static async hashPassword(user: Admin) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
