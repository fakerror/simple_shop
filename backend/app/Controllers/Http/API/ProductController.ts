import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'

export default class ProductController {
  public async index(ctx: HttpContextContract) {
    async function get() {
      const id = ctx.request.qs()['id']
      if (id === undefined) {
        return await Product.all()
      }
      return await Product.find(id)
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
  public async list(_: HttpContextContract) {
    return await Product.all()
  }
  public async search(_: HttpContextContract) {
    return await Product.all()
  }
}
