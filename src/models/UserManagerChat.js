import { v4 as uuidv4 } from 'uuid';
import knex from 'knex';

class Chat {

    constructor(options, nameTableMessages, nameTableUsers) {
        this.options = options;
        this.nameTableMessages = nameTableMessages;
        this.nameTableUsers = nameTableUsers;

        this.database = this.connection();
    }

    connection() {
        return knex(this.options);
    }

    async saveUsers(user){
        const newUser = {
            id_user : uuidv4(),
            ...user
        }
        try {
            await this.database.from('users').insert(newUser);
            return {
                status : "success",
                message : 'User added correctly'
            }

        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un error en la BD',
                error
            } 
        }
        
    }

    async getAllUsers() {
        try {
            const results = await this.database.from(this.nameTableUsers).select('*');
            return {
                status : "success",
                message : 'Users obtenly correctly',
                results
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un error en la BD',
                error
            } 
        }
    }

    async save(message) {
        try {
            await this.database.from("messages").insert(message);
            return {
                status : "success",
                message : 'Message added correctly'
            } 
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un error en la BD',
                error
            } 
        }
    }

    async getAllMessages() {
        try {
            let results = await this.database.from(this.nameTableMessages).select('*');
            return {
                status : "success",
                message : 'Users obtenly correctly',
                results
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un error en la BD',
                error
            } 
        }
    }

}

export default Chat