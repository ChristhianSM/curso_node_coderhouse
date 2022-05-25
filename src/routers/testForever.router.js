import express from 'express';

import cluster from 'cluster';
const router = express.Router();

router.get('/', (req, res) => {
    
    for (let i = 0; i < 5e8; i++) {
    }
    
    // cluster.worker.kill();
    res.send(`Proceso numero ${process.pid} ahoraa`)
})

export default router;