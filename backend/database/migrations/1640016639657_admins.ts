import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Admins extends BaseSchema {
  protected tableName = 'admins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 64).unique().primary()
      table.string('username', 255).notNullable().unique().index()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()

      table.datetime('created_at').notNullable()
      table.datetime('updated_at').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
