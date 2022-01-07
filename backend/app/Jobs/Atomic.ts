import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import { JobContract, JobsOptions, QueueOptions, WorkerOptions } from '@ioc:Rocketseat/Bull'
import Order from 'App/Models/Order'
import Product from 'App/Models/Product'
import User from 'App/Models/User'

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/
export enum Action {
  order_make = 'order_make',
  order_trans_info_set = 'order_trans_info_set',
  product_quantity_add = 'product_quantity_add',
}

export class JobData {
  public action: Action
  public args: any
}

async function dev_wait(ms: number = 3000) {
  const isDevelopment = Env.get('NODE_ENV') === 'development'
  if (!isDevelopment) {
    return
  }
  return await new Promise((resolve) => setTimeout(() => resolve(0), ms))
}
export default class Atomic implements JobContract {
  public options: JobsOptions = {}
  public queueOptions: QueueOptions = {}
  public workerOptions: WorkerOptions = {}
  public concurrency = 1

  public static key = 'Atomic'
  public key = Atomic.key

  public async handle_order_make(args: any) {
    Logger.info(Object.assign({ job_start: 'handle_order_make' }, args))
    await dev_wait()

    await Database.transaction(async (trx) => {
      const user = await User.findOrFail(args.user_id, trx)
      const product = await Product.findOrFail(args.product_id, trx)
      const quantity = args.quantity

      if (product.quantity < quantity) {
        throw '商品数量不足'
      }

      product.quantity -= quantity
      await product.save()

      const order = await user
        .related('orders')
        .create({ product_id: product.id, quantity: quantity })
      await order.save()
    })

    Logger.info('job_end handle_order_make')
  }
  public async handle_order_trans_info_set(args: any) {
    Logger.info(Object.assign({ job_start: 'handle_order_trans_info_set' }, args))
    await dev_wait()

    await Database.transaction(async (trx) => {
      const order = await Order.findOrFail(args.order_id, trx)
      order.trans_info = args.trans_info
      await order.save()
    })

    Logger.info('job_end handle_order_trans_info_set')
  }
  public async handle_product_quantity_add(args: any) {
    Logger.info(Object.assign({ job_start: 'handle_product_quantity_add' }, args))
    await dev_wait()

    await Database.transaction(async (trx) => {
      const product = await Product.findOrFail(args.product_id, trx)
      product.quantity += args.quantity_add
      await product.save()
    })

    Logger.info('job_end handle_product_quantity_add')
  }

  public async handle(job: any) {
    const data = job.data as JobData

    switch (data.action) {
      case Action.order_make:
        return await this.handle_order_make(data.args)
      case Action.order_trans_info_set:
        return await this.handle_order_trans_info_set(data.args)
      case Action.product_quantity_add:
        return await this.handle_product_quantity_add(data.args)
      default:
        Logger.error(`unknown action ${data.action}`)
    }
  }
}
