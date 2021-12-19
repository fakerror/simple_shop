import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'

export default class OrderController {
  public async index(ctx: HttpContextContract) {
    async function get() {
      const id = ctx.request.qs()['id']
      if (id === undefined) {
        return await Order.all()
      }
      return await Order.find(id)
    }
    async function post() {}
    async function put() {}
    switch (ctx.request.method()) {
      case 'GET':
        return await get()
      case 'POST':
        return await post()
      case 'PUT':
        return await put()
      default:
        ctx.response.badRequest(`未知的方法 ${ctx.request.method()}`)
        return
    }
  }
}
