import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.scss'
import { setToken } from "../token"

export default function Login() {
    const navigate = useNavigate()
    const [Data, setData] = useState({
        login: '',
        password: ''
    })

    // const [userData, setUserData] = useState(null)

    const updateLogin = async (e) => {
        const { name, value } = e.target

        setData({
            ...Data,
            [name]: value
        })
    }

    const Login = async (e) => {
        e.preventDefault()
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}/users/login`, {
                method: "POST",
                headers: {
                    'Content-type': "application/json",
                },
                body: JSON.stringify(Data)
            })
            const data = await response.json()
            setToken(data.token)
            navigate('/tasks')
            // const userDataToken = usersData()
            // if (userDataToken) {
            //     setUserData({
            //         id: userDataToken.id,
            //         login: userDataToken.login,
            //         company_id: userDataToken.company_id
            //     })
            // }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main className="login-page">
            <div className="main__container container">
                <form className="main__form" onSubmit={
                    Login
                }>
                    <div className="form__row">
                        <label >Логин</label>
                        <input type="text"
                            name="login" value={Data.login}
                            onChange={updateLogin} />
                    </div>
                    <div className="form__row">
                        <label >Пароль</label>
                        <input type="text"
                            name="password" value={Data.password}
                            onChange={updateLogin} />
                    </div>
                    <button type="submit">
                        Логин
                    </button>
                </form>
                {/* <div className="main__data">
                    {userData &&(
                        <div className="data">
                            <p>{userData.login}</p>
                            <p>{userData.id}</p>
                            <p>{userData.company_id}</p>
                        </div>
                    )}
                </div> */}
            </div>
        </main>
    )
}