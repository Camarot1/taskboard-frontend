import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { usersData } from '../token'
import './header.scss'
import { useTheme } from '../../theme';

interface UserData {
    id: number;
    login: string;
}

export default function Header() {
    const {theme, toggleTheme} = useTheme()
    const [userData, setUserData] = useState<UserData | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        setUserData(usersData())
        
    }, [])

    return (
        <header className={`header header-${theme}`}>
            <div className="header__container">
                {userData && <button className="header__button" onClick={() => navigate('/tasks')}>Задачи</button>}
                {userData && <button className="header__button" onClick={() => navigate('/addTask')}>Добавить</button>}
                <button className="header__button" onClick={() => navigate('/login')}>Логин</button>
                <button className="header__button" onClick={() => navigate('/register')}>Регистрация</button>
                <button className="header__button" onClick={toggleTheme}>{theme === 'white' ? 'Темная' : 'Светлая' }</button>
            </div>
        </header>
    )
}