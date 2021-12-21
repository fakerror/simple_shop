import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Job from 'App/Jobs/UserLogging'
import Bull from '@ioc:Rocketseat/Bull'
import User from 'App/Models/User'

export default class LogRequest {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    if (await ctx.auth.check()) {
      const u = ctx.auth.user
      if (u instanceof User && u?.username !== undefined) {
        const log = `${ctx.request.method()}: ${ctx.request.url()}`
        await Bull.add(Job.key, { username: u?.username, log: log })
      }
    }
    await next()
  }
}
