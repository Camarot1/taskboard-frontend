import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './addTask.scss'
import { usersData } from '../token'

interface FormData {
    name: string;
    title: string;
    description: string;
    status: string;
    display_order: number
}

interface UserData {
    id: number;
    login: string;
}

interface Companies{
    id: number;
    name: string;
}

export default function AddTask() {
    const navigate = useNavigate()
    const [userData, setUserData] = useState<UserData>({
        id: 0,
        login: ''
    })

    useEffect(() => {
        const userDataFromToken = usersData()
        if (!userDataFromToken) {
            navigate("/login")
            return
        }
        setUserData(userDataFromToken)
    }, [navigate])


    const [formData, setFormData] = useState<FormData>({
        name: '',
        title: '',
        description: '',
        status: 'todo',
        display_order: 1
    })

    const handleUpdate = async (e: React.ChangeEvent<HTMLTextAreaElement>): Promise<void> => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })

    }

    const handleAddTask = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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

    const [companies, setCompanies] = useState<Companies[]>([])

    useEffect(() => {
        if (userData) {
            loadCompanies()
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
            const data: Companies[] = await response.json()
            setCompanies(data)

            if (data.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    name: data[0]?.name ?? '',
                }))
            }
        } catch (error) {
            alert(error)
        }
    }

    const selectChange = (e: React.ChangeEvent<HTMLSelectElement>):void => {
        const value = e.target.value
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
                        <textarea name="title"
                            value={formData.title} onChange={handleUpdate} />
                    </div>
                    <div className="form__group">
                        <label >Описание</label>
                        <textarea name="description" className="big"
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