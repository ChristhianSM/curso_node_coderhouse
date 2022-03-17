import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const options = {
    client : 'sqlite3',
    connection : {
        filename: path.join(__dirname + '/../db/dbMessages.sqlite')
    }
}

export default options