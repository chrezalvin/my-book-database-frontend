import debug from "debug";

export const BASE_URL = process.env.REACT_APP_API_BASE_URL;
if (!BASE_URL)
    throw new Error("REACT_APP_API_BASE_URL is not defined in environment variables")

const debugConfig = process.env.REACT_APP_DEBUG;

if(debugConfig)
    debug.enable(debugConfig);