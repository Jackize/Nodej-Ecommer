const config = require('./src/config/config.mongodb')
const app = require('./src/app')

const PORT = config.app.port || 3000

const server = app.listen(PORT, () => {
    // clear terminal
    console.clear()
    console.log(`Server is running on port ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('\nServer closed')
        process.exit(0)
    })
})
