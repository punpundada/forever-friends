import z from 'zod'

export default z.string().trim().email({message:"Invalid email id"}).min(1,'Please enter email')