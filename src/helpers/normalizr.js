import {normalize, denormalize, schema} from 'normalizr';
export const normalizrMessages = (data) => {
    const authorSchema = new schema.Entity('authors');
    const messagesSchema = new schema.Entity('messages', {
        author : authorSchema,
    });

    const normalizarMensajes = normalize(data, [messagesSchema]);
    console.log(JSON.stringify(normalizarMensajes, null, '\t'))

}