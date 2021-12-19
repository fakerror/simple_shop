/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import Bull from '@ioc:Rocketseat/Bull'

const PORT = 9999
const isDevelopment = Env.get('NODE_ENV') === 'development'

function isACECMD(): boolean {
  if (Env.get('ACE_CMD') === true) {
    return true
  }
  return false
}

if (isACECMD()) {
  Logger.warn('ace cmd running, skip the Bull queue init')
} else {
  Bull.process()

  if (isDevelopment) {
    Bull.ui(PORT)
  }
}
