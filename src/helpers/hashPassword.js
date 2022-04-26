import bcrypt from 'bcrypt';

export const createHash = (password) => {
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10)
    )
}

export const validatePassword = (password, passwordEncrypt) => {
    return bcrypt.compareSync(password, passwordEncrypt);
}