import express from 'express'
import usuarioroutes from './routes/usuarioroutes.js'


//Crea una constancia de contenedor WEB
const app = express();
const PORT = process.env.PORT ?? 3000;

//Habilitar el Template Engine (PUG)
app.set("view engine", "pug");
app.set("views", "./views")

//Definimos el Template Engine (PUG)
app.use(express.static('public'))


app.use("/auth", usuarioroutes)

app.listen(PORT, ()=>{
    console.log(`Èl servidor esta iniciado en el puerto ${PORT}`)
})