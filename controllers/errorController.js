const AppError = require('../utils/appError');

// const handleGenericError = () =>
//   new AppError('Something went very wrong!', 500);

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFielsdDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token! Please login again!', 401);

const handleJWLExpiredError = () =>
  new AppError('Your token has experid! Please login again.', 401);

const errorSendDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const errorSendProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  //console.log(err.name);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    errorSendDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFielsdDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWLExpiredError();

    // if (err.name === 'CastError') error = handleCastErrorDB(err);
    // else if (err.code === 11000) error = handleDuplicateFielsdDB(err);
    // else if (err.name === 'ValidationError')
    //   error = handleValidationErrorDB(err);
    // else if (err.name === 'JsonWebTokenError') error = handleJWTError();
    // else if (err.name === 'TokenExpiredError') error = handleJWLExpiredError();
    // else error = handleGenericError(err);
    errorSendProd(error, res);
  }
};
