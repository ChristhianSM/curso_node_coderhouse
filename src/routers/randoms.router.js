import express from 'express';
import { fork } from 'child_process';

const router = express.Router();

const child = fork("./src/process/numbersRandoms.js");
router.get('/randoms', (req, res) => {
    const amount = (req.query.cant);
    child.send(`start-${amount}`)
    child.on('message', childMessage => {
        res.json(childMessage)
    })
})

export default router;