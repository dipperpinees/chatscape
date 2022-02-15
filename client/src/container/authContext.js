import { createContext } from "react";

const authContext = createContext({
    authentication: false,
    setAuthentication: (auth) => {}
});

export const getToken = () => {
    return authContext();
}

export default authContext;