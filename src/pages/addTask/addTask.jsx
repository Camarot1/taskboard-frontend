import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './addTask.scss'
import { usersData } from '../token'

export default function AddTask() {
    const navigate = useNavigate()
    const [Task, setTask] = useState([])
    const [userData, setUserData] = useState('')

    useEffect(() => {
        const userDataFromToken = usersData()
        if (!userDataFromToken) {
            navigate("/login")
        }
        setUserData(userDataFromToken)
    }, [navigate])


    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        status: 'todo',
        display_order: 1
    })

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
            const dataToSend = {
                username: userData.login,
                ...formData
            }
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
            alert('Задача добавлена')
        } catch (error) {
            console.error(error)
        }
    }

    const [companies, setCompanies] = useState([])
    const [selectedCompany, setSelectedCompany] = useState('')

    useEffect(() => {
        if (userData) {
            loadCompanies(userData.id)
        }
    }, [userData])

    const loadCompanies = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/users/company/${userData.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            setCompanies(data)

            if (data.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    name: data[0].name,
                }))
            }
        } catch (error) {
            alert(error)
        }
    }

    const selectChange = (e) => {
        const value = e.target.value
        setSelectedCompany(value)
        setFormData((prev) => ({
            ...prev,
            name: value
        }))

    }

    return (
        <main className="addTask-page">
            <div className="main__container">
                <h1 className="main__title">Добавить задачу</h1>
                <form className="main__form" onSubmit={handleAddTask}>
                    <div className="form__group">
                        <label >Имя Добавляющего</label>
                        {userData.login}
                    </div>
                    <div className="form__group">
                        <label >Название компании</label>
                        <select className="main__select" onChange={selectChange} name="" id="company-select">
                            {companies.map(item => (
                                <option key={item.id} value={item.name}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form__group">
                        <label >Заголовок</label>
                        <textarea type="text" name="title"
                            value={formData.title} onChange={handleUpdate} />
                    </div>
                    <div className="form__group">
                        <label >Описание</label>
                        <textarea type="text" name="description" className="big"
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