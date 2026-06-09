import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './addTask.scss'
import { usersData } from '../token'

export default function AddTask() {
    const navigate = useNavigate()
    const [Task, setTask] = useState([])
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        title: '',
        description: '',
        status: 'todo',
        display_order: 1
    })

    useEffect(() => {
        const userDataFromToken = usersData()
        if (!userDataFromToken) {
            navigate("/login")
        }
    }, [navigate])

    const handleUpdate = async (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleAddTask = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            alert('Задача добавлена')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main className="addTask-page">
            <div className="main__container">
                <h1 className="main__title">Добавить задачу</h1>
                <form className="main__form" onSubmit={handleAddTask}>
                    <div className="form__group">
                        <label >Имя пользователя</label>
                        <input type="text" name="username" className="form-style"
                            value={formData.username} onChange={handleUpdate} />
                    </div>
                    <div className="form__group">
                        <label >Название компании</label>
                        <input type="text" name="name" className="form-style"
                            value={formData.name} onChange={handleUpdate} />
                    </div>
                    <div className="form__group">
                        <label >Заголовок</label>
                        <input type="text" name="title" className="form-style"
                            value={formData.title} onChange={handleUpdate} />
                    </div>
                    <div className="form__group">
                        <label >Описание</label>
                        <input type="text" name="description" className="form-style"
                            value={formData.description} onChange={handleUpdate} />
                    </div>

                    <button type="submit" className="form__button">
                        Добавить задачу
                    </button>
                </form>
            </div>
        </main>
    )
}