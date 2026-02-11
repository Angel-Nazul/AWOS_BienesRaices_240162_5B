import express from 'express'
import usuarioRoutes from './routes/usuariotoutes.js'

//Crea una constancia de contenedor WEB
const app = express();
const PORT = process.env.PORT ?? 3000;

app.use("/", usuarioRoutes)

app.listen(PORT, ()=>{
    console.log(`Èl servidor esta iniciado en el puerto ${PORT}`)
})