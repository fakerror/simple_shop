import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductController {
  public async index(ctx: HttpContextContract) {
    return ctx
  }
}
