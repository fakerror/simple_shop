import { ApiResponse, Client } from '@elastic/elasticsearch'
import Application from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'
import { JobContract, JobsOptions, QueueOptions, WorkerOptions } from '@ioc:Rocketseat/Bull'

export default class ElasticAdd implements JobContract {
  public options: JobsOptions = {}
  public queueOptions: QueueOptions = {}
  public workerOptions: WorkerOptions = {}
  public concurrency = 2

  public static key = 'ElasticAdd'
  public key = ElasticAdd.key

  public async handle(job: any) {
    const data = job.data
    Logger.info(`job_start elastic ${data.index} add`)

    const Elastic: Client = Application.container.use('Elastic')

    const response: ApiResponse = await Elastic.index({
      id: data.data.id,
      index: data.index,
      body: data.data,
    })

    Logger.info('job_end elastic_add')
  }
}
