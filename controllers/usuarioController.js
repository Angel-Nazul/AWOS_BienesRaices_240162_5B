import Usuario from '../models/usuario.js'

const formularioLogin = (req, res) =>{
    res.render("auth/login", {pagina: "Inicia sesión"});
}

const formularioRegistro = (req, res) =>{
    res.render("auth/registro", {pagina: "Registrate con nosotros :"});
}


const registrarUsuario = async(req,res) =>
{
    console.log("Intentando registrar a un Usuario Nuevo con los datos del formulario");
    console.log(req,res);
    const data =
    {
        name: req.body.nombreUsuario,
        email: req.body.emailUsuario,
        password: req.body.passwordUsuario
    }
    const usuario = await Usuario.create(data);
    res.json(usuario)
}

const formularioRecuperacion = (req, res) =>{
    res.render("auth/recuperarPasword", {pagina: "Registrate con nosotros :"});
}

export{ formularioLogin, formularioRegistro, registrarUsuario, formularioRecuperacion,}