const { ValidationError } = require('sequelize');
const handleError = (error) => {
    console.log("fsjdfgdjsh");
    console.log(error instanceof ValidationError);
  if (error instanceof ValidationError) {
    return res.status(200).json({
        Status: 0,
        message: error.message,
      });
    // return {
    //   status: 400,
    //   message: "Validation error",
    //   details: error.errors.map((err) => err.message),
    // };
  }

  // For database or generic errors
//   return res.status(500).json({
//     Status: 0,
//     error: "Internal server error",
//     details: error.message,
//   });
  // return {
  //     status: 500,
  //     message: 'Internal server error',
  //     details: error.message
  // };
};

module.exports = { handleError };
