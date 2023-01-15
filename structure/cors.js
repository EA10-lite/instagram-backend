
const cors = require("cors");

const cors_options = {
    origin: ["http://localhost:3000"],
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': true,
    credentials: true 
}

module.exports = (app) => {
    app.use(cors(cors_options));
}