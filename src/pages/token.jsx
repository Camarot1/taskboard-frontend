export const setToken = (token) => localStorage.setItem('token', token)
export const getToken =() => localStorage.getItem('token')
export const deleteToken = ()=> localStorage.removeItem('token')


export const decode = (token) =>{
    if(!token) return null
    try{
        const data = token.split(".")[1]
        return JSON.parse(atob(data))
    }catch(error){
        console.error("Ошибка декодирования ", error)
        return null
    }
}

export const usersData = () =>{
    const token = getToken()
    if (!token) return null
    const data = decode(token)
    if (!data) return null

    return {
        id: data.id,
        login: data.login,
        company_id: data.company_id
    }
}