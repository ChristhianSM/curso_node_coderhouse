import express, {request, response} from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import fileStrategy from 'session-file-store';
import MongoStore from 'connect-mongo';

//Para leer variables de entorno
dotenv.config();

const router = express.Router();

const FileStorage = fileStrategy(session);

router.use(cookieParser());
router.use(session({
    store: MongoStore.create({
        mongoUrl : process.env.MONGODB_CNN_SESSIONS,
        ttl: 3600
    }),
    secret: 'mongoSecret1213',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge : 20000
     }
}))

router.post('/login', (req = request, res = response) => {
    req.session.user = req.body.user;
    req.session.name = req.body.name;
    req.session.lastname = req.body.lastname;
    res.json({
        status: "success"
    })
})

router.get('/login', (req = request, res = response) => {
    console.log(req.session)
   const {name, user, lastname} = req.session;
   const currentUser  = {
        name, user, lastname
   }
    res.json(currentUser)
})

export default router;