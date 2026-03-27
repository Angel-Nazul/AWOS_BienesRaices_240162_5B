import express from 'express';
import usuarioroutes from './routes/usuarioroutes.js';
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

const app = express();

// Template Engine (PUG)
app.set("view engine", "pug");
app.set("views", "./views");

// Archivos estáticos
app.use(express.static('public'));

// Lectura de datos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookies y sesión
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || "PC-BienesRaices_240162_csrf_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// CSRF Protection (única instancia)
const csrfProtection = csurf({ cookie: true });

// Excluir rutas OAuth del CSRF
app.use((req, res, next) => {
    const publicRoutes = [
        '/auth/google/callback',
        '/auth/github/callback'
    ];
    if (publicRoutes.some(route => req.path.includes(route))) {
        return next();
    }
    csrfProtection(req, res, next);
});

// Variables locales para todas las vistas
app.use((req, res, next) => {
    res.locals.csrfToken = typeof req.csrfToken === 'function' ? req.csrfToken() : null;
    res.locals.usuario = req.user || null;  // ← Asegura que usuario siempre exista
    next();
});

// Rutas
app.use("/auth", usuarioroutes);

// Página protegida "mis-propiedades"
app.get('/mis-propiedades', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    res.render('main/mis-propiedades', {
        pagina: 'Mis Propiedades',
        usuario: req.user
    });
});

// Manejador de errores (incluye CSRF)
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

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
    console.log(`El servidor está iniciado en el puerto ${PORT}`);
});