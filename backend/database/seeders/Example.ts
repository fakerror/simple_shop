import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Order from 'App/Models/Order'
import Product from 'App/Models/Product'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true
  public async run() {
    if (!(await User.first())) {
      Logger.info('creat User data')
      await User.createMany([
        {
          username: 'test',
          password: 'test',
        },
        {
          username: 'user1',
          password: 'user1',
        },
        {
          username: 'user2',
          password: 'user2',
        },
      ])
    }
    if (!(await Product.first())) {
      Logger.info('creat Product data')
      await Product.createMany([
        {
          name: 'product1',
          description: 'product1 description',
          value: 1000,
          quantity: 999,
        },
        {
          name: 'product2',
          description: 'product2 description',
          value: 2000,
          quantity: 2999,
        },
      ])
    }
    if (!(await Order.first())) {
      Logger.info('creat Order data')
      const product = await Product.findByOrFail('name', 'product1')
      const user = await User.findByOrFail('username', 'test')
      let order = await user.related('orders').create({ product_id: product.id, quantity: 10 })
      await order.save()
      order = await user.related('orders').create({ product_id: product.id, quantity: 10 })
      await order.save()
      order = await user.related('orders').create({ product_id: product.id, quantity: 10 })
      await order.save()
    }
  }
}
