import express from 'express'


//Crea una constancia de contenedor WEB
const app = express();
const PORT = process.env.PORT ?? 3000;


app.get("/", (req, res)=>{
    res.json({
        status:200,
        message: "Bienvenido al Sistema de Bienes Raices"
    })
})

app.post("/createUser", (req, res) =>
    {
        console.log("Se esta procesando una peticion del tipo post")
        const nuevoUsuario = {
            nombre:"Angel Nazul Gutierrez Cruz",
            correo:"a.nazul.gc@gmail.com"
        }
        
        res.json({
            status:200,
            message:`Se ha solicitado la creacion de un nuevo usuario con nombre: ${nuevoUsuario.nombre} y correo: ${nuevoUsuario.correo}`
        })
    })

app.post("/actualizaroferta/", ()=>{
    console.lof("Se esta procesando una peticion del tipo PUT");
    const mejorOfertaCompra =
    {
        clienteID: 5158,
        propiedad: 1305,
        montoOfertado: "$125,300.00"
    }
    
    const nuevaOferta =
    {
        clienteID: 1578,
        propiedad: 1305,
        montoOfertado: "$130,000.00"
    }

    res.json({
        status:200,
        message: `Se ha actualizado la mejor oferta, de un valor de ${mejorOfertaCompra.montoOfertado} a ${nuevaOferta.montoOfertado} por el cliente: ${mejorOfertaCompra.clienteID}`
    })
})

//PATCH
app.patch("/actualizarPassword/:nuevoPassword", (req, res) => {
  const usuario = {
    nombre: "Arcadio Hernandez",
    correo: "arcadio@gmail.com",
    password: "123456789"
  }

  const {nuevoPassword} = req.params;
  res.json({
    status: 200,
    message: `La contraseña: ${usuario.password} ha sido actualizada a: ${nuevoPassword}`
  })
})

app.delete("/borrarPropiedad/:id", (req, res) => {
    console.log("Se esta procesando una petición del tipo DELETE");
    
    // Extraemos el id de los parámetros de la URL
    const { id } = req.params;

    // Enviamos la respuesta como un objeto JSON válido
    res.json({
        status: 200,
        message: `Se ha eliminado la propiedad con id: ${id}`
    });
});

app.listen(PORT, ()=>{
    console.log(`Èl servidor esta iniciado en el puerto ${PORT}`)
})
