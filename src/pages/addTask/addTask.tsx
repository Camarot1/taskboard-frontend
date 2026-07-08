import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './addTask.scss'
import { usersData } from '../token'

interface FormData {
    name: string;
    title: string;
    description: string;
    status: string;
    timeline: string;
    display_order: number
}

interface UserData {
    id: number;
    login: string;
    companies_id: number[];
}

interface Companies {
    id: number;
    name: string;
}

export default function AddTask() {
    const navigate = useNavigate()
    
    const [userData, setUserData] = useState<UserData>({
        id: 0,
        login: '',
        companies_id: []
    })
    const [companies, setCompanies] = useState<Companies[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    const [formData, setFormData] = useState<FormData>({
        name: '',
        title: '',
        description: '',
        status: 'todo',
        display_order: 1
    })

    useEffect(() => {
        const initializeData = async () => {
            const userDataFromToken = usersData()
            
            if (!userDataFromToken) {
                navigate("/login")
                return
            }
            
            setUserData(userDataFromToken)
            
            try {
                const response = await fetch(`${process.env.REACT_APP_URL}/users/company/${userDataFromToken.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                
                const data: Companies[] = await response.json()
                
                setCompanies(data)
                if (data.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        name: data[0]?.name ?? '',
                    }))
                }
            } catch (error) {
                console.error('Ошибка загрузки компаний:', error)
                alert('Не удалось загрузить список компаний')
            } finally {
                setIsLoading(false)
            }
        }
        
        initializeData()
    }, [navigate])

    const handleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
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
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            alert('Задача добавлена')
        } catch (error) {
            console.error('Ошибка при добавлении задачи:', error)
            alert('Не удалось добавить задачу')
        }
    }

    const selectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = e.target.value
        setFormData((prev) => ({
            ...prev,
            name: value
        }))
    }

    if (isLoading || !userData) {
        return <div>Загрузка...</div>
    }

    return (
        <main className="addTask-page">
            <div className="main__container">
                <h1 className="main__title">Добавить задачу</h1>
                <form className="main__form" onSubmit={handleAddTask}>
                    <div className="form__group">
                        <label>Имя Добавляющего</label> <span>{userData.login}</span>
                    </div>
                    <div className="form__group">
                        <label>Название компании</label>
                        <select 
                            className="main__select" onChange={selectChange} name="company" id="company-select" value={formData.name}>
                            {companies.length === 0 ? (
                                <option value="">Нет доступных компаний</option>
                            ) : (
                                companies.map(item => (
                                    <option key={item.id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="form__group">
                        <label>Заголовок</label>
                        <textarea 
                            name="title"
                            value={formData.title} 
                            onChange={handleUpdate} 
                        />
                    </div>
                    <div className="form__group">
                        <label>Описание</label>
                        <textarea 
                            name="description" 
                            className="big"
                            value={formData.description} 
                            onChange={handleUpdate} 
                        />
                    </div>
                            
                    <button type="submit" className="form__button">
                        Добавить задачу
                    </button>
                </form>
            </div>
        </main>
    )
}