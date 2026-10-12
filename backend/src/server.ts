import app from './app.js'
import 'dotenv/config'

const startServer = async () => {
    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
}

startServer().catch(err => {
    console.error(err);
    process.exit(1);
})