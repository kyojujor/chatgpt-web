import log4js from 'log4js'

log4js.configure({
  appenders: {
    userAccess: {
      type: 'file',
      filename: 'user-access.log',
    },
  },
  categories: {
    default: {
      appenders: ['userAccess'],
      level: 'info',
    },
  },
})

// 创建 logger 实例
const logger = log4js.getLogger('userAccess')

interface SendResponseOptions<T = any> {
  type: 'Success' | 'Fail'
  message?: string
  data?: T
}

export function sendResponse<T>(options: SendResponseOptions<T>) {
  if (options.type === 'Success') {
    return Promise.resolve({
      message: options.message ?? null,
      data: options.data ?? null,
      status: options.type,
    })
  }

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    message: options.message ?? 'Failed',
    data: options.data ?? null,
    status: options.type,
  })
}

/**
 * Logs a record of a login.
 *
 * @param {string} userid - The user ID.
 * @param {string} content - The content of the log.
 */
export function log4recordLogin(userid: string, content?: string) {
  logger.info(`[${userid}] [${content}]`)
}
