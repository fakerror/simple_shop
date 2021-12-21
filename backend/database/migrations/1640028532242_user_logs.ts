import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserLogs extends BaseSchema {
  protected tableName = 'user_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.datetime('created_at').index()

      table.string('username', 255).notNullable().index()
      table.text('log').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
