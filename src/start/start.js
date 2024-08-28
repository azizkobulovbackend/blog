const config = require('../../config')


const start = (app) => {
    const PORT = config.port
    app.listen(PORT, () => {
        console.log(PORT);
    })
} 

module.exports = start