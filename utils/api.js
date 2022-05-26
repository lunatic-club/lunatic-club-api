import httpStatus from 'http-status-codes'
import {PassThrough} from 'stream'

export const getBearerToken = ctx => ctx.req.headers.authorization.split(' ')[1]

export const createResponse = (ctx, result) => {
  result.matchWith({
    Just: ({value}) => {
      ctx.body = value
      ctx.status = httpStatus.StatusCodes.OK
    },
    Nothing: () => {
      ctx.status = httpStatus.StatusCodes.NOT_FOUND
    }
  })
}

export const createBasicResponse = (ctx, result) => {
  ctx.body = result
  ctx.status = result
    ? httpStatus.StatusCodes.OK
    : httpStatus.StatusCodes.NOT_FOUND
}

export const throwWithError = (ctx, error) => {
  ctx.throw(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, error)
}

export const createStreamResponse = (ctx, stream, contentType) => {
  ctx.set('Content-Type', contentType)
  ctx.body = stream.pipe(PassThrough())
  ctx.status = httpStatus.StatusCodes.OK
}

