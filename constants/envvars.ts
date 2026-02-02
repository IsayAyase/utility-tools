interface EnvVarProps {
    readonly MONGO_URI: string
    readonly SERVICE_SECRET: string
}

const envvars: EnvVarProps = {
    MONGO_URI: process.env.MONGO_URI as string,
    SERVICE_SECRET: process.env.SERVICE_SECRET as string
}

export default envvars;