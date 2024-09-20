require('dotenv').config();

const db = require('./Database/connect.js');



// const contactusRoutes = require('./Routes/contactusRoute.js');
// const scheduleRoutes = require('./Routes/scheduleRoute.js');
// const sendmessageRoutes = require('./Routes/sendmessageRoute.js');
// const path = require('path');
// const inspectionRoutes = require('./Routes/inspectionRoutes');
// const observationRoutes = require('./Routes/observationRoutes');

// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// const User = require('./models/user');



const { app } = require('./app');

const PORT = process.env.PORT || 8080;  

const start = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
    // db.sequelize.sync({alter: true}).then(() => {
    //     app.listen(PORT, () => {
    //       console.log(`Server running on http://localhost:${PORT}`);
    //     });
    //   }).catch(error => {
    //     console.error('Error syncing database:', error);
    //   });

};


start();

// process.exit(1);



