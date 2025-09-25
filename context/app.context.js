import {createContext, useContext, useState} from "react"

const appContext = createContext(undefined);

export const AppProvider = ({children}) => {
    const [prevPath,setPrevPath] = useState("");

    return (
        <appContext.Provider
            value={{
                prevPath,
                setPrevPath
            }}
        >
            {children}
        </appContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(appContext);

    return context;
}