import express, {request, response} from 'express';
import flash from 'connect-flash'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import fileStrategy from 'session-file-store';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { dbConnection } from '../database/mongo/config.database.js';
import User from '../models/user.js';
import { createHash, validatePassword } from '../helpers/hashPassword.js';
import { isUserLogged } from '../middlewares/middlewaresProducts.js';

//Para leer variables de entorno
dotenv.config();
dbConnection();
const router = express.Router();

const FileStorage = fileStrategy(session);

router.use(flash())
router.use(cookieParser());
router.use(session({
    store: MongoStore.create({
        mongoUrl : process.env.MONGODB_CNN_SESSIONS,
        ttl: 3600
    }),
    secret: process.env.KEY_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge : 3000
     }
}))

router.use(passport.initialize());
router.use(passport.session());

//Serializacion y deserializacion al usuario
passport.serializeUser((user, done) => {
    return done(null, user);
})
passport.deserializeUser((id, done) => {
    User.findById(id , (err, user) => {
        return done(err, user);
    })
})

//Creamos las estrategias
passport.use('signUpStrategy', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    async (req, email, password, done) => {
        //Si el usuario existe, no se puede volver a registrar
        try {
            const user = await User.findOne({email: email});
         
            if (user) {
                return done(null, false, req.flash('SignUpMessage', 'Hola mundo'));
            }

            const newUser = {
                email,
                name : req.body.name,
                password : createHash(password)
            }   
            //Si el usuario no existe, procede a aagregarlo a la base de datos
            const userCreated = await User.create(newUser);
            req.session.user = req.body.name;
            return done(null, userCreated);

        } catch (error) {
            console.log(error)
        }
    }
))

passport.use('signInStrategy', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    async (req, email, password, done) => {
        //Si el usuario existe, no se puede volver a registrar
        try {
            const user = await User.findOne({email: email});
            if (!validatePassword(password, user.password)) return done(null, false, req.flash('SignUpMessage', 'Password incorrect'));
            
            req.session.user = user.name;
            return done(null, user);
        } catch (error) {
            console.log(error)
        }
    }
))

router.post('/login',passport.authenticate("signInStrategy", {
    successRedirect: '/products.html',
    failureRedirect : '/',
}), (req = request, res = response) => {
    res.redirect('/autentication/validateUser')
})

router.post('/register',passport.authenticate("signUpStrategy", {
    successRedirect: '/products.html',
    failureRedirect : '/validate.html',
}) , (req = request, res = response) => {
    res.json({
        status: "success"
    })
})

router.get('/validateUser', isUserLogged , (req = request, res = response) => {
    res.render(path.join(__dirname + '/../public/products.html'))
})

router.get('/login', (req = request, res = response) => {
   console.log(req.session.user)
   res.status(400).json({
       user: req.session.user
   })
})

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/')
})

export default router;