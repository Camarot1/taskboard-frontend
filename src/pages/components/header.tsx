import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { usersData } from '../token'
import './header.scss'

interface UserData {
    id: number;
    login: string;
}

export default function Header() {
    const [userData, setUserData] = useState<UserData | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        setUserData(usersData())
        
    }, [])

    return (
        <header className='header header-white'>
            <div className="header__container">
                {userData && <button className="header__button" onClick={() => navigate('/tasks')}>Задачи</button>}
                {userData && <button className="header__button" onClick={() => navigate('/addTask')}>Добавить</button>}
                <button className="header__button" onClick={() => navigate('/login')}>Логин</button>
                <button className="header__button" onClick={() => navigate('/register')}>Регистрация</button>
            </div>
        </header>
    )
}