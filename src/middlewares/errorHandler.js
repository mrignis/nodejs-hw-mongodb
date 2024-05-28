// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: err.message,
    });
  };
  
  export default errorHandler;
  