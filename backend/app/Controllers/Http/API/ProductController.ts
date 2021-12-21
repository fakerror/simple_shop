import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
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
    async function post() {
      const validator = schema.create({
        name: schema.string({ trim: true }),
        description: schema.string({ trim: true }),
        value: schema.number(),
        quantity: schema.number(),
      })
      const args = await ctx.request.validate({ schema: validator })

      const product = new Product()
      product.fill(args)
      await product.save()
    }
    async function put() {
      const validator = schema.create({
        id: schema.string({ trim: true }),
        name: schema.string({ trim: true }),
        description: schema.string({ trim: true }),
        value: schema.number(),
        quantity: schema.number(),
      })
      const args = await ctx.request.validate({ schema: validator })

      const product = await Product.find(args.id)
      if (!product) {
        return
      }
      product.name = args.name
      product.description = args.description
      product.value = args.value
      product.quantity = args.quantity
      await product.save()
    }
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
