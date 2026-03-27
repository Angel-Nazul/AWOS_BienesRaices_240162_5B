import {check, validationResult } from 'express-validator'
import Usuario from '../models/usuario.js'
import {generarJWT, generarToken} from '../lib/tokens.js'
import {emailRegistro, emailResetearPassword, emailDesbloqueo} from '../lib/emails.js'

const formularioLogin = (req, res) => {
     res.render("auth/login", {
        pagina: "Inicia sesión",
        csrfToken: req.csrfToken()
    });
}

const formularioRegistro = (req,res) =>{
    res.render("auth/registro", {
        pagina: "Registrate con nosotros :)",
        csrfToken: req.csrfToken()
    });
}

const registrarUsuario = async(req,res) =>
{
    console.log("Intentando registrar a un Usuario Nuevo con los datos del formulario:");
    const {nombreUsuario:name, emailUsuario: email, passwordUsuario:password} = req.body 

    // Validación de los datos del formulario previo a registro en la BD
    await check('nombreUsuario').notEmpty().withMessage("El nombre de la persona no puede ser vacío").run(req);
    await check('emailUsuario').notEmpty().withMessage("El correo electrónico no puede ser vacío").isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req)
    await check('passwordUsuario').notEmpty().withMessage("La contraseña parece estar vacía").isLength({ min: 8 , max:30}).withMessage("La longitud de la contraseña debe ser entre 8 y 30 caractéres").run(req);
    await check('confirmacionUsuario').custom((value, { req }) => {
        if (value !== req.body.passwordUsuario) {
            throw new Error("Las contraseñas no coinciden");
        }
        return true;
    }).run(req)

    let resultadoValidacion = validationResult(req);

    if (!resultadoValidacion.isEmpty()) {
        return res.render("auth/registro", {
            pagina: "Regístrate con nosotros :)",
            csrfToken: req.csrfToken(),
            errores: resultadoValidacion.array(),
            usuario: { nombreUsuario: name, emailUsuario: email }
        });
    }

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({where: {email: email}});

    if(existeUsuario) {
        return res.render("auth/registro", { 
            pagina: "Registrate con nosotros :) ", 
            csrfToken: req.csrfToken(),
            errores: [{msg:` Ya existe un usuario asociado al correo: ${email}`}],
            usuario: { nombreUsuario: name, emailUsuario: email }
        });
    }

    // Si no hay errores, crear usuario
    if(resultadoValidacion.isEmpty())
    {
        const data = {
            name, 
            email, 
            password,
            token: generarToken()
        }
        const usuario = await Usuario.create(data);

        // Enviar correo
        emailRegistro({
            nombre: usuario.name,
            email: usuario.email,
            token: usuario.token
        })

        res.render("templates/mensaje",{
            title: "¡Bienvenid@ a BienesRaíces!",
            msg: `La cuenta asociada al correo: ${email}, se ha creado exitosamente, te pedimos confirmar tu a través del correo electrónico que te hemos enviado. `
        })
    }
    else 
        res.render("auth/registro", { 
            pagina: "Error al interar crear una cuenta.", 
            csrfToken: req.csrfToken(),
            errores: resultadoValidacion.array(), 
            usuario: { nombreUsuario: name,
                emailUsuario: email
            }});
}

const paginaConfirmacion = async(req, res) =>
{
     const {token:tokenCuenta} = req.params
     console.log("Confirmando la cuenta asociada al token: ", tokenCuenta);

     //Confirmar si el token existe en la BD
     const usuarioToken = await(Usuario.findOne({where:{token:tokenCuenta }}))
     console.log(usuarioToken);

     if(!usuarioToken)
     {
        res.render("templates/mensaje",{
            title: "Error al confirmar la cuenta",
            msg: `El código de verificación (no es válido), por favor intentalo de nuevo.`,
            buttonVisibility: false,
            buttonText: null,
            buttonURL: null});
     }

     else {
     // Actualizar los datos del usuario.
     usuarioToken.token=null;
     usuarioToken.confirmed=true;
     usuarioToken.save();

     res.render("templates/mensaje",{
            title: "Confirmación exitosa",
            msg: `La cuenta de:  ${usuarioToken.name}, asociada al correo electrónico: ${usuarioToken.email} se ha confirmado, ahora ya puedes ingresar a la plataforma.`,buttonVisibility: true,
            buttonText: "Ingresar a BienesRaices-240162!",
            buttonURL: "/auth/login"});
    }

}

const formularioRecuperacion = (req,res) =>
{
    res.render("auth/recuperarPassword", {pagina: "Te ayudamos a restaurar tu contraseña", csrfToken: req.csrfToken()});
}

const formularioActualizacionPassword = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render("templates/mensaje", {
            title: "Error",
            pagina: "Enlace no válido",
            msg: "El token de recuperación ha expirado o es incorrecto.",
            buttonVisibility: true,
            buttonText: "Volver",
            buttonURL: "/auth/recuperarPassword"
        });
    }

    res.render("auth/resetearPassword", {
        pagina: "Ingresa tu nueva contraseña",
        csrfToken: req.csrfToken(),
        token: token
    });
};

const resetearPassword = async(req, res) =>
{
    const {emailUsuario:usuarioSolicitante} = req.body
    console.log(`El usuario con correo: ${usuarioSolicitante} esta solicitando un reseteo de contraseña.`)

    const {emailUsuario: email} = req.body 

        // Validaciones del Frontend 
        await check('emailUsuario').notEmpty().withMessage("El correo electrónico no puede ser vacío").isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req)
        
        let resultadoValidacion = validationResult(req);

     if(!resultadoValidacion.isEmpty())
     {
         res.render("auth/recuperarPassword", { 
            pagina: "Error, correo inválido", 
            errores: resultadoValidacion.array(), 
            usuario: { emailUsuario: email  }});
     }

    // Validación 1
    const usuario = await Usuario.findOne({where: { email: usuarioSolicitante}});
    // SELECT email FROM tb_users WHERE email =  usuarioSolicitante;   // SQL Injection
    if(!usuario)
    {
            res.render("templates/mensaje",{
            title: "Error, buscando la cuenta",
            msg: `No se ha encontrado ninguna cuenta asociada al correo: ${usuarioSolicitante}`,
            buttonVisibility: true,
            buttonText: "Intentalo de nuevo",
            buttonURL: "/auth/recuperarPassword"
            });
    
    }
    else
    {
        //Validacion Backend - El usuario existente ya valido su cuenta?
        if (!usuario.confirmed)         
        {
            res.render("templates/mensaje",{
            title: "Error, la cuenta no esta confirmada",
            msg: `La  cuenta asociada al correo: ${usuarioSolicitante}, no ha sido validad a través de la liga segura enviada al correo electrónico.`,
            buttonVisibility: true,
            buttonText: "Intentalo de nuevo",
            buttonURL: "/auth/recuperarPassword"
            });
        }  
         else
        {
            // Actualizar el token
            usuario.token = generarToken();
            usuario.save();
            // Enviar el token por correo   
            emailResetearPassword({
                nombre: usuario.name,
                email: usuario.email,
                token: usuario.token
            })

            // Responder con una vista de correo enviada
            res.render("templates/mensaje",{
                title: "Correo para la Restauración de Contraseñas",
            msg: `Un paso más, te hemos enviado un correo electrónico con la liga segura para la restauración de tu contraseña.`,
            buttonVisibility: false});
        }
    
}
}

const nuevoPassword = async (req, res) => {
    // Validaciones
    await check('nuevoPassword').isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres').run(req);
    await check('confirmarPassword').custom((value, { req }) => {
        if (value !== req.body.nuevoPassword) {
            throw new Error('Las contraseñas no coinciden');
        }
        return true;
    }).run(req);
    
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return res.render("auth/resetearPassword", {
            pagina: "Ingresa tu nueva contraseña",
            csrfToken: req.csrfToken(),
            token: req.params.token,
            errores: resultado.array()
        });
    }

    const { token } = req.params;
    const { nuevoPassword } = req.body; 
    const usuario = await Usuario.findOne({ where: { token } });

    if(!usuario) {
        return res.render("templates/mensaje", {
            title: "Error",
            pagina: "Token inválido",
            msg: "No se pudo identificar al usuario para el cambio de clave.",
            buttonVisibility: true,
            buttonText: "Volver",
            buttonURL: "/auth/recuperarPassword"
        });
    }

    usuario.password = nuevoPassword; 
    usuario.token = null;
    usuario.intentos = 0;
    usuario.bloqueado = false;
    await usuario.save();

    res.render("templates/mensaje", {
        title: "Contraseña Actualizada",
        pagina: "¡Cambio Exitoso!",
        msg: "Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.",
        buttonVisibility: true,
        buttonText: "Iniciar sesión",
        buttonURL: "/auth/login"
    });
};

const autenticarUsuario = async(req, res, next) => {
    const {emailUsuario: email, passwordUsuario: password} = req.body
    console.log(`Un usuario: ${email} con password: ${password} quiere logearse al sistema`);

    // Validaciones de front
    await check('emailUsuario').notEmpty().withMessage("El correo electrónico no puede ser vacío").isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req)
    await check('passwordUsuario').notEmpty().withMessage("La contraseña parece estar vacía").isLength({ min: 8 , max:30}).withMessage("La longitud de la contraseña debe ser entre 8 y 30 caractéres").run(req);

    let resultadoValidacion = validationResult(req);

    if(!resultadoValidacion.isEmpty()) {
        return res.render("auth/login", { 
            pagina: "Error al intentar ingresar a la plataforma", 
            csrfToken: req.csrfToken(),
            errores: resultadoValidacion.array(),
            // No pasar usuario
        });
    }

    const usuario = await Usuario.findOne({where:{email}});

    if(!usuario) {
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            csrfToken: req.csrfToken(),
            errores: [{msg: `No existe un usuario asociado a : ${email}`}]
        });
    }

    if(usuario.bloqueado){
        return res.render("auth/login", {
            pagina: "Inicia sesión",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "Cuenta bloqueada. Revisa tu email para desbloquearla." }]
        });
    }

    if(!usuario.confirmed) {
        return res.render("auth/login",{
            pagina: "Error al intentar ingresar a la plataforma",
            csrfToken: req.csrfToken(),
            errores: [{msg: `La cuenta asociada a : ${email} no ha sido confirmada`}]
        });
    }

    console.log("Validando Contraseñas")
    console.log("->",usuario.verificarPassword(password),"<-");

    if(!usuario.verificarPassword(password)) {
        usuario.intentos++;
        if(usuario.intentos >= 5){
            usuario.bloqueado = true;
            usuario.token = generarToken();
            try {
                await emailDesbloqueo({ nombre: usuario.name, email: usuario.email, token: usuario.token });
            } catch (error) {
                console.error("Error enviando correo de desbloqueo");
            }
        }
        await usuario.save();
        return res.render("auth/login", {
            pagina: "Inicia sesión",
            csrfToken: req.csrfToken(),
            errores: [{ msg: `Contraseña incorrecta. Intentos restantes: ${5 - usuario.intentos}` }]
        });
    } else {
        usuario.intentos = 0;
        await usuario.save();
        req.login(usuario, (err) => {
            if (err) return next(err);
            return res.redirect("/mis-propiedades");
        });
    }
};
 
const cerrarSesion = (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/auth/login');
        });
    });
};

const desbloquearCuenta = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } });
    if (!usuario) {
        return res.render("templates/mensaje", {
            title: "Error",
            pagina: "Enlace no válido",
            msg: "El enlace de desbloqueo ha expirado."
        });
    }
    usuario.bloqueado = false;
    usuario.intentos = 0;
    usuario.token = null;
    await usuario.save();

    res.render("templates/mensaje", {
        title: "Cuenta Desbloqueada",
        pagina: "¡Listo!",
        msg: "Tu cuenta ha sido desbloqueada. Ya puedes iniciar sesión.",
        buttonVisibility: true,
        buttonText: "Iniciar Sesión",
        buttonURL: "/auth/login"
    });
};

const formularioEditarFoto = (req, res) => {
    res.render('auth/editar-foto', {
        pagina: 'Editar Foto de Perfil',
        csrfToken: req.csrfToken(),
        usuario: req.user
    });
};

const actualizarFoto = async (req, res) => {
    const { nuevaImagen } = req.body;
    try {
        const usuario = await Usuario.findByPk(req.user.id);
        usuario.imagen = nuevaImagen;
        await usuario.save();
        res.redirect('/mis-propiedades');
    } catch (error) {
        res.redirect('/mis-propiedades');
    }
};

export const misPropiedades = (req, res) => {
    // Asegúrate de que el usuario esté autenticado
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.render('main/mis-propiedades', { 
        usuario: req.user  // pasa los datos del usuario a la vista
    });
};

export { formularioLogin, formularioRegistro, registrarUsuario, formularioRecuperacion, paginaConfirmacion, resetearPassword, formularioActualizacionPassword, autenticarUsuario, nuevoPassword, cerrarSesion, desbloquearCuenta,formularioEditarFoto, actualizarFoto}
