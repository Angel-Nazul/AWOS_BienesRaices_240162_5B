import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import Usuario from "../models/usuario.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
            return done(new Error("No se pudo obtener el email de Google"), null);
        }

        let usuario = await Usuario.findOne({ where: { email: email.toLowerCase() } });

        if (!usuario) {
            usuario = await Usuario.create({
                name: profile.displayName || "Usuario Google",
                email: email.toLowerCase(),
                imagen: profile.photos?.[0]?.value || null,
                password: null, 
                confirmed: true,
                intentos: 0,
                bloqueado: false
            });
        }
        
        return done(null, usuario);
    } catch (error) {
        return done(error, null);
    }
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:40666/auth/github/callback",
    scope: ['user:email']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
            return done(new Error("No se pudo obtener el email de GitHub"), null);
        }

        let usuario = await Usuario.findOne({ where: { email: email.toLowerCase() } });

        if (!usuario) {
            usuario = await Usuario.create({
                name: profile.displayName || profile.username || "Usuario GitHub",
                email: email.toLowerCase(),
                imagen: profile.photos?.[0]?.value || profile._json.avatar_url || null,
                password: null,
                confirmed: true,
                intentos: 0,
                bloqueado: false
            });
        }

        return done(null, usuario);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await Usuario.findByPk(id);
        done(null, usuario);
    } catch (error) {
        done(error, null);
    }
});

export default passport;