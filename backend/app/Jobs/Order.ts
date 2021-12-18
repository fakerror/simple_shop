import { JobContract, JobsOptions, QueueOptions, WorkerOptions } from '@ioc:Rocketseat/Bull'

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

export default class Order implements JobContract {
  public options: JobsOptions = {}
  public queueOptions: QueueOptions = {}
  public workerOptions: WorkerOptions = {}
  public concurrency = 1
  public key = 'Order'

  public async handle(job) {
    const { data } = job

    function wait(ms: number) {
      return new Promise((resolve) => setTimeout(() => resolve(0), ms))
    }
    console.log(data)
    await wait(10000)
    console.log(data)
  }
}
