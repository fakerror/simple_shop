import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Orders extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 64).unique().primary()
      table.datetime('created_at').notNullable().index()
      table.datetime('updated_at').notNullable().index()

      table
        .string('user_id', 64)
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
        .index()
      table
        .string('product_id', 64)
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .notNullable()
        .index()
      table.decimal('quantity', 10, 0).notNullable() // 10亿级
      table.text('trans_info').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
