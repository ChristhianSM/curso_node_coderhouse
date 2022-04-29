import express from 'express';

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
    const argument = process.argv;
    const namePlataform = process.platform;
    const versionNode = process.version;
    const memoryReserve = process.memoryUsage();
    const pathExe = process.execPath;
    const processId =  process.pid;
    const fileProyect = process.env.PWD;

    const info = {
        argument,
        namePlataform,
        versionNode,
        memoryReserve,
        pathExe,
        processId,
        fileProyect
    }
    res.json(
        info
    )
})

export default router;