import bcrypt from "bcrypt";

export const hash = async (password: string): Promise<string> => {
    try {
        const saltRounds = 10
        
        return await bcrypt.hash(password, saltRounds)
    } catch (error) {
        throw new Error("Password hashing has failed.")
    }
}

export const verify = async (password: string, hashed_password: string): Promise<boolean> => {
    try {
        const passwordMatched = await bcrypt.compare(password, hashed_password)

        if (!passwordMatched) {
            return false
        }

        return true
    } catch (error) {
        throw new Error("Password validation has failed." + error)
    }
}