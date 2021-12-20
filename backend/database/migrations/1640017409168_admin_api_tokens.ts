import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AdminApiTokens extends BaseSchema {
  protected tableName = 'admin_api_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('user_id', 64).references('id').inTable('admins').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('type').notNullable()
      table.string('token', 64).notNullable().unique()

      table.datetime('expires_at').nullable()
      table.datetime('created_at').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
