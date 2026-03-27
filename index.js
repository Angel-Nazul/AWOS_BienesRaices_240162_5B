//console.log("Hola desde JS");
import express from 'express';
import usuarioroutes from './routes/usuarioroutes.js';
import { connectDB } from './config/db.js';
import session from "express-session";
import cookieParser from "cookie-parser";
import csurf from "@dr.pogodin/csurf";
import passport from "passport";
import dotenv from 'dotenv';
import db from './config/db.js';
import "./config/passport.js";

dotenv.config();

try {
    await db.authenticate();
    await db.sync(); 
    console.log('Conexión y sincronización exitosa a la base de datos');
} catch (error) {
    console.log('Error en la conexión a la DB:', error);
}

//Crea una constancia de contenedor WEB
const app = express();

//Habilitar el Template Engine (PUG)
app.set("view engine", "pug");
app.set("views", "./views")

//Definimos el Template Engine (PUG)
app.use(express.static('public'))

//Habilitar lectura de datos a traves de las peticiones (REQUEST)
app.use(express.urlencoded({extended: true}))
// Activamos la opción para poder manipular Cookies - Almacenamiento en el cliente (navegador) 
app.use(cookieParser());
app.use(express.json());

// Definimos el Middleware  - 
app.use(session({
    secret: process.env.SESSION_SECRET||"PC-BienesRaices_240162_csrf_secret",
    resave: false,
    saveUninitialized: false, 
    cookie: {
        httpOnly: true, 
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
        }
    }));

app.use(passport.initialize());
app.use(passport.session());

const csrfProtection = csurf({ cookie: true });

app.use((req, res, next) => {
    const publicroutes = [
        '/auth/google/callback',
        '/auth/github/callback'
    ];
    
    if (publicroutes.some(route => req.path.includes(route))) {
        return next();
    }
    csrfProtection(req, res, next);
});

app.use((req, res, next) => {
    res.locals.csrfToken = typeof req.csrfToken === 'function' ? req.csrfToken() : null;
    res.locals.usuario = req.user || null; 
    next();
});

app.use("/auth", usuarioroutes);

app.get('/mis-propiedades', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }

    res.render('main/mis-propiedades', {
        pagina: 'Mis Propiedades',
        usuario: req.user
    });
});

//Habilitamos el mecanismo para protección de CSRF
app.use(csurf())


// Habilitar los tokes de CSRF para cualquier formulario
app.use((req, res, next) =>
{
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/auth", usuarioroutes)
await connectDB();

// Cachear el error
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).render("templates/mensaje", {
            pagina: "Error de seguridad",
            title: "Error CSRF",
            msg: "El formulario expiró o fue manipulado. Recarga la página.",
            buttonVisibility: true,
            buttonText: "Volver",
            buttonURL: "/auth/login"
        });
    }
    console.error(err.stack);
    res.status(500).send('Algo salió mal en el servidor');
    next(err);
});

app.listen(process.env.PORT ?? 4000, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${process.env.PORT}`)
})