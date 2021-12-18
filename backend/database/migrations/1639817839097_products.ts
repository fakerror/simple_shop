import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 64).unique().primary()
      table.datetime('created_at').notNullable().index()
      table.datetime('updated_at').notNullable().index()

      table.text('name').notNullable()
      table.text('description').notNullable()
      table.decimal('value', 10, 2).notNullable() // 10亿级 小数点后有两位
      table.decimal('quantity', 10, 0).notNullable() // 10亿级
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
