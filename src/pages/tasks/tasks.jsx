import React, { useState, useEffect } from "react"
import './tasks.scss'
import { useNavigate } from 'react-router-dom'
import { usersData, deleteToken } from '../token'
export default function TasksPage() {

    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState([])
    const [updatingTaskId, setUpdatingTaskId] = useState(null)
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const loadData = async () => {
            const userDataFromToken = usersData()
            setUserData(userDataFromToken)
            if (!userDataFromToken) {
                navigate("/login")
            } else {
                await fetchTask(userDataFromToken.id)
                setLoading(false)
            }
        }
        loadData()
    }, [navigate])

    const fetchTask = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/${userId}`)
            const data = await response.json()
            setTasks(data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleStatusChange = async (taskId, newStatus) => {
        setUpdatingTaskId(taskId)
        const userId = userData.id
        const username = userData?.name
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/patch/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus, user_id: userId, username: username })
            })

            if (!response.ok) {
                throw new Error('Ошибка при обновлении статуса')
            }

            const updatedTask = await response.json()

            setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? updatedTask : task))
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Ошибка при обновлении статуса')
        } finally {
            setUpdatingTaskId(null)
        }
    }

    const handleArchiveTask = async (taskId) => {
        if (!window.confirm(`Вы уверены, что хотите отправить задачу в архив?`)) {
            return;
        }

        setUpdatingTaskId(taskId)
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/done/${taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error('Ошибка при архивации задачи')
            }

            alert('Задача успешно отправлена в архив!')
            await fetchTask(userData.id)
        } catch (error) {
            console.error('Error archiving task:', error)
            alert('Ошибка при архивации задачи')
        } finally {
            setUpdatingTaskId(null)
        }
    }

    const redirectEdit = async (item) => {
        try {
            navigate(`/edit-task/${item}`)
        } catch (error) {
            alert(error)
        }
    }

    const todoTasks = tasks.filter(task => task.status === 'todo')
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
    const doneTasks = tasks.filter(task => task.status === 'done')


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
        } catch (error) {
            alert(error)
        }
    }

    const selectChange = (e) => {
        const value = e.target.value
        setSelectedCompany(value)
        if (value === 'my-tasks') {
            fetchTask(userData.id)
        } else if (value) {
            takeTask(value)
        }else{
            setTasks([])
        }

    }

    const takeTask = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/companytask/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const res = await response.json()
            setTasks(res)
        } catch (error) {
            alert(error)
        }
    }
    if (loading) {
        return <div>Загрузка...</div>
    }

    return (
        <main className='main-page'>
            <div className="main__container">
                <h1 className="main__title">Задачи</h1>
                <div className="main__nick">Ваш никнейм: {userData.login}</div>
                <select onChange={selectChange} name="" id="company-select">
                    <option value="my-tasks">Личные задачи</option>
                    {companies.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <button className="main__button" onClick={() => {
                    deleteToken()
                    navigate('/login')
                }}>
                    Выйти
                </button>
                <div className="main__tasks">
                    <div className="tasks__column">
                        <p className="column__title">To-Do</p>
                        <div className="tasks">
                            {todoTasks.length === 0 ? (
                                <div>Нет задач</div>
                            ) : (
                                todoTasks.map(item => (
                                    <div className="task" key={item.id}>
                                        <p className="title">{item.title}</p>
                                        <p className="desc">{item.description}</p>
                                        <p className="name">Имя добавившего: {item.username}</p>
                                        <button className="button-block"
                                            onClick={() => handleStatusChange(item.id, 'in-progress')}
                                            disabled={updatingTaskId === item.id}
                                        >
                                            {updatingTaskId === item.id ? 'Обновление...' : 'Взять в работу'}
                                        </button>
                                        <button className="button-block red" onClick={() => redirectEdit(item.id)}>Редактировать</button>
                                    </div>
                                ))
                            )}</div>
                    </div>

                    <div className="tasks__column">
                        <p className="column__title">In Progress</p>
                        <div className="tasks">
                            {inProgressTasks.length === 0 ? (
                                <div>Нет задач</div>
                            ) : (
                                inProgressTasks.map(item => (
                                    <div className="task" key={item.id}>
                                        <p className="title">{item.title}</p>
                                        <p className="desc">{item.description}</p>
                                        <p className="name">Имя взявшего: {item.username}</p>
                                        <div className="button-block">
                                            <button
                                                onClick={() => handleStatusChange(item.id, 'todo')}
                                                disabled={updatingTaskId === item.id}
                                            >
                                                Назад
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(item.id, 'done')}
                                                disabled={updatingTaskId === item.id}
                                            >
                                                Завершить
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="tasks__column">
                        <p className="column__title">Done</p>
                        <div className="tasks">
                            {doneTasks.length === 0 ? (
                                <div>Нет задач</div>
                            ) : (

                                doneTasks.map(item => (
                                    <div className="task" key={item.id}>
                                        <p className="title">{item.title}</p>
                                        <p className="desc">{item.description}</p>
                                        <p className="name">Имя закончившего: {item.username}</p>
                                        <div className="button-block">
                                            <button
                                                onClick={() => handleStatusChange(item.id, 'in-progress')}
                                                disabled={updatingTaskId === item.id}
                                            >
                                                Вернуть
                                            </button>
                                            <button className="red" onClick={() => handleArchiveTask(item.id)}
                                                disabled={updatingTaskId === item.id}>Архив</button>
                                        </div>
                                    </div>
                                ))
                            )}</div>
                    </div>
                </div>
            </div>
        </main >
    )
}