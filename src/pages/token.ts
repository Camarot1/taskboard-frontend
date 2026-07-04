export const setToken = (token: string) :void => localStorage.setItem('token', token)
export const getToken =():string | null => localStorage.getItem('token')
export const deleteToken = ():void => localStorage.removeItem('token')


interface DecodedToken{
    id: number;
    login: string;
    exp: number;
    companies_id: number[];
    [key: string]: unknown
}

export const decode = (token: string): DecodedToken | null =>{
    if(!token) return null
    try{
        const part = token.split(".")
        const data = part[1]
        if(!data) return null

        return JSON.parse(atob(data)) as DecodedToken
    }catch(error){
        console.error("Ошибка декодирования ", error)
        return null
    }
}

interface userData{
    id: number;
    login: string;
}

export const usersData = ():userData | null =>{
    const token = getToken()
    if (!token) return null
    const data = decode(token)
    if (!data) return null
    const currentTime = Date.now() /1000
    if (currentTime > data.exp){
        return null
    }
    return {
        id: data.id,
        login: data.login
    }
}
