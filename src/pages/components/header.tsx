import React from 'react'
import { useNavigate } from 'react-router-dom';
import './header.scss'
export default function Header() {

    const navigate = useNavigate()


    return (
        <header className='header'>
            <div className="header__container">
                <button className="header__button" onClick={() => navigate('/tasks')}>Задачи</button>
                <button className="header__button" onClick={() => navigate('/addTask')}>Добавить</button>
                <button className="header__button" onClick={() => navigate('/login')}>Логин</button>
                <button className="header__button" onClick={() => navigate('/register')}>Регистрация</button>
            </div>
        </header>
    )
}