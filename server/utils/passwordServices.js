import bcrypt from "bcrypt";

const encryptPassword = async (rawPassword) => {

    const saltRounds = 8;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPasswort = await bcrypt.hash(rawPassword, salt);
        return hashPasswort;
    } catch (error) {
        console.log('Error during hashing password :>> ', error);
        return null;
    }
}

const isPasswordCorrect = async (rowPass, hashPassword) => {
    const isPasswordMatch = await bcrypt.compare(rowPass, hashPassword);
    if (isPasswordMatch) {
        return true;
    } else {
        return false;
    }
}

export { encryptPassword, isPasswordCorrect }