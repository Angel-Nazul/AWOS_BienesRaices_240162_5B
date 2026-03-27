import express from 'express'
import passport from "passport";
import { check } from 'express-validator';
import * as usuarioController from '../controllers/usuarioController.js';
import { 
    formularioLogin, 
    formularioRecuperacion, 
    formularioRegistro, 
    registrarUsuario,
    paginaConfirmacion, 
    formularioActualizacionPassword, 
    resetearPassword, 
    autenticarUsuario, 
    formularioEditarFoto, 
    desbloquearCuenta, 
    cerrarSesion, 
    actualizarFoto, 
    nuevoPassword,
    misPropiedades
} from '../controllers/usuarioController.js'

const router = express.Router();

// ============================================================
// GET
// ============================================================
router.get("/login", formularioLogin)
router.get("/registro", formularioRegistro)
router.get("/recuperarPassword", formularioRecuperacion)
router.get("/recuperarPassword/:token", formularioRecuperacion)
router.get("/confirma/:token", paginaConfirmacion)
router.get("/actualizarPassword/:token", formularioActualizacionPassword)
router.get("/perfil/editar-foto", formularioEditarFoto);
router.get("/desbloquear/:token", desbloquearCuenta);

// Rutas OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/mis-propiedades', failureRedirect: '/auth/login' }));
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
router.get('/github/callback', passport.authenticate('github', { successRedirect: '/mis-propiedades', failureRedirect: '/auth/login' }));

router.get('/logout', cerrarSesion);
router.get("/mis-propiedades", misPropiedades); 

// ============================================================
// POST
// ============================================================
router.post("/login", [
    check('emailUsuario').isEmail().withMessage('El email es obligatorio').trim(),
    check('passwordUsuario').notEmpty().withMessage('La contraseña es obligatoria')
], autenticarUsuario);

router.post("/registro", [
    check('nombreUsuario').notEmpty().withMessage('El nombre es obligatorio').trim(),
    check('emailUsuario').isEmail().withMessage('Email no válido').trim(),
    check('passwordUsuario').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
    check('confirmacionUsuario').custom((value, { req }) => {
        if(value !== req.body.passwordUsuario) {
            throw new Error('Las contraseñas no coinciden')
        }
        return true
    })
], registrarUsuario);

router.post("/recuperarPassword", [
    check('emailUsuario').isEmail().withMessage('Email no válido').trim()
], resetearPassword);

// Ruta para actualizar contraseña con token (POST) - ambas versiones compatibles
router.post("/actualizarPassword/:token", [
    check('nuevoPassword').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
], nuevoPassword);

router.post("/nuevo-password/:token", [
    check('nuevoPassword').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
], nuevoPassword);

// Ruta para actualizar foto
router.post("/perfil/editar-foto", actualizarFoto);

router.post("/createUser", (req, res) => {
    console.log("Se esta procesando una petición del tipo POST");
    const nuevoUsuario = {
        nombre:"Angel Nazul Gutierrez Cruz",
        correo:"a.nazul.gc@gmail.com"
    };
    res.json({
        status:200, 
        message: `Se ha solicitado la creación de un nuevo usuario con nombre: ${nuevoUsuario.nombre} y correo: ${nuevoUsuario.correo}`
    });
});

// ============================================================
// PUT / PATCH / DELETE
// ============================================================
router.put("/actualizarOferta/", (req, res) => {
    console.log("Se esta procesando una petición del tipo PUT");
    const mejorOfertaCompra = {
        clienteID: 5158,
        propiedad: 1305,
        montoOfertado: "$125,300.00"
    };
    const nuevaOferta = {
        clienteID: 1578,
        propiedad: 1305,
        montoOfertado: "$130,000.00"
    };
    res.json({
        status:200, 
        message: `Se ha actualizado la mejor oferta, de un valor de ${mejorOfertaCompra.montoOfertado} a ${nuevaOferta.montoOfertado} por el cliente: ${mejorOfertaCompra.clienteID}`
    });
});

router.patch("/actualizarPassword/:nuevoPassword", (req, res) => {
    console.log("Se esta procesando una petición del tipo PATCH");
    const usuario = {
        nombre: "Angel Nazul Gutierrez Cruz",
        correo: "a.nazul.gc@gmail.com", 
        password: "123456789"        
    };
    const {nuevoPassword} = req.params;
    res.json({
        status:200,
        message: `La contraseña: ${usuario.password} ha sido actualizada a: ${nuevoPassword}`
    });
});

router.delete("/borrarPropiedad/:id", (req, res) => {
    console.log("Se esta procesando una petición del tipo DELETE");
    const {id} = req.params;
    res.json({
        status:200, 
        message: `Se ha eliminado la propiedad con id : ${id}`
    });
});

export default router