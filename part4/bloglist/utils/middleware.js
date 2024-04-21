const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request,response,next)=>{
    logger.info('Method', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('Token:  ', request.token)
    logger.info('---')
    next()
}

const unknownEndpoint = (request,response) =>{
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log('error ', error)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })

  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  }else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '');
      next();
  } else {
      // 如果没有提供有效的 Authorization 头部，可以在这里进行适当的处理，例如返回错误响应
      response.status(401).json({ error: 'Unauthorized. Missing or invalid token.' });
  }
};

// 找出用户并将其设置为请求对象
const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  } else {
    request.user = decodedToken
    next()
  }
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}