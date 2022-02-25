const path = require('path');
const fs = require('fs');

class Chat {

    constructor(pathFile) {
        this.pathFile = pathFile;
        this.pathFileUser = __dirname + '/../files/user.txt';
    }

    async save(message) {
    
        try {
            //Verificamos que exista el documento
            if (fs.existsSync(this.pathFile)) {
                const data = (await fs.promises.readFile(this.pathFile, "utf-8"));

                //Verificamos si el archivo contiene productos, por que unicamente puede estar creado pero sin productos 
                if (data !== "" && JSON.parse(data).length > 0) {
                    const messages = JSON.parse(data);
                    messages.push(message);
                    await fs.promises.writeFile(this.pathFile, JSON.stringify(messages, null, 2));
                    return {
                        status : "Success",
                        message : "Message saved successfully"
                    }
                }
            }

            await fs.promises.writeFile(this.pathFile, JSON.stringify([message], null, 2));
            return {
                status : "Success",
                message : "Message saved successfully"
            }
            
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }

    async getAll() {
        try {
            if (fs.existsSync(this.pathFile)) {
                const messages = JSON.parse(await fs.promises.readFile(this.pathFile, "utf-8"));
                return {
                    status: 'success',
                    mensaje : "Messages obtained correctly",
                    payload : messages
                };  
            }else{
                await fs.promises.writeFile(this.pathFile, JSON.stringify([], null, 2));
                return {
                    status: "success",
                    mensaje : "Messages obtained correctly",
                    payload : []
                };
            }
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }

    async saveUsers(user){
        try {
            //Verificamos que exista el documento
            if (fs.existsSync(this.pathFileUser)) {
                const data = (await fs.promises.readFile(this.pathFileUser, "utf-8"));

                //Verificamos si el archivo contiene productos, por que unicamente puede estar creado pero sin productos 
                if (data !== "" && JSON.parse(data).length > 0) {
                    const users = JSON.parse(data);
                    users.push(user);
                    await fs.promises.writeFile(this.pathFileUser, JSON.stringify(users, null, 2));
                    return {
                        status : "Success",
                        message : "User saved successfully"
                    }
                }
            }

            await fs.promises.writeFile(this.pathFileUser, JSON.stringify([user], null, 2));
            return {
                status : "Success",
                message : "User saved successfully"
            }
            
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }

    async getAllUsers() {
        try {
            if (fs.existsSync(this.pathFileUser)) {
                const users = JSON.parse(await fs.promises.readFile(this.pathFileUser, "utf-8"));
                return {
                    status: 'success',
                    mensaje : "Messages obtained correctly",
                    payload : users
                };  
            }else{
                await fs.promises.writeFile(this.pathFileUser, JSON.stringify([], null, 2));
                return {
                    status: "success",
                    mensaje : "Messages obtained correctly",
                    payload : []
                };
            }
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }
}

module.exports = Chat