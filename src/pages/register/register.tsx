import React, { useState } from "react";
import './register.scss'
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme";

interface Data {
    email: string;
    username: string;
    password: string;
}

export default function RegisterPage() {
    const {theme} = useTheme()
    const [data, setData] = useState<Data>({
        email: '',
        username: '',
        password:''
    })
    const navigate = useNavigate()
    const fetchData = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/users/register`, {
                method: "POST",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(data)
            })
            alert('Регистрация успешна')
        } catch (error) {
            alert(error)
        }
    }
    const updateRegister = async(e: React.ChangeEvent<HTMLInputElement>): Promise<void>=>{
        const {name, value} = e.target
        setData({
            ...data,
            [name]:value
        })
    }
    return (
        <div className={`register-page register-page-${theme}`}>
            <div className="main__container">
                <h1 className="main__title">Регистрация</h1>
                <form className='main__form' onSubmit={fetchData}>
                    <div className="form__row">
                        <label >Почта</label>
                        <input type="text" className="form" name="email"
                         value={data.email} onChange={updateRegister}/>
                    </div>
                    <div className="form__row">
                        <label >Имя</label>
                        <input type="text" className="form" name="username"
                         value={data.username} onChange={updateRegister}/>
                    </div>
                    <div className="form__row">
                        <label >Пароль</label>
                        <input type="password" className="form" name="password"
                         value={data.password} onChange={updateRegister}/>
                    </div>
                    <button>Зарегистрироваться</button>
                </form>
            </div>
        </div>
    )
}