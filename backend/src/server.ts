import app from './app.js'

const startServer = async () => {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
}

startServer().catch(err => {
    console.error(err);
    process.exit(1);
})