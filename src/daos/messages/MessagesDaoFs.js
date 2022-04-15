import path  from 'path'
import Container from '../../containers/containerFs.js';
import { __dirname } from '../../helpers/getDirname.js';

class MessagesDaoFs extends Container {
    constructor() {
        super(path.join(__dirname + "/../files/messages.txt"), path.join(__dirname + "/../files/user.txt"));
    }
}

export default MessagesDaoFs