import { BaseModel, beforeCreate, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Bull from '@ioc:Rocketseat/Bull'
import Job from 'App/Jobs/ElasticAdd'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
export default class Product extends BaseModel {
  public static selfAssignPrimaryKey = true
  @beforeCreate()
  public static assignUuid(product: Product) {
    product.id = uuid()
  }
  @column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public value: number

  @column()
  public quantity: number

  @beforeSave()
  public static async saveToEs(product: Product) {
    await Bull.add(Job.key, {
      index: this.table,
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
      },
    })
  }
}
