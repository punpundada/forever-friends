import z, { ZodError } from 'zod';

const envarSchema = z.object({
    DATABASE_URL:z.string({required_error:"DATABASE_URL is missing"}),
    NODE_ENV:z.string({required_error:"NODE_ENV is missing"}),
    POSTGRES_PASSWORD:z.string({required_error:"POSTGRES_PASSWORD is missing"}),
    POSTGRES_USER:z.string({required_error:"POSTGRES_USER is missing"}),
    POSTGRES_DB:z.string({required_error:"POSTGRES_DB is missing"}),
})



try {
    envarSchema.parse(process.env)
} catch (error) {
    if(error instanceof ZodError){
        console.error(error.issues)
        process.exit(1)
    }
}


export default  envarSchema.parse(process.env)