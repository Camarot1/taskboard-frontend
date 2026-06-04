import React, { useState, useEffect } from "react"
import './main.scss'
import { useNavigate } from 'react-router-dom'
export default function MainPage() {

    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState([])
    const [updatingTaskId, setUpdatingTaskId] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            await fetchTask()
            setLoading(false)
        }
        loadData()
    }, [])

    const fetchTask = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/1`)
            const data = await response.json()
            setTasks(data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleStatusChange = async (taskId, newStatus) => {
        setUpdatingTaskId(taskId)
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/patch/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
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

            await fetchTask()
            alert('Задача успешно отправлена в архив!')
        } catch (error) {
            console.error('Error archiving task:', error)
            alert('Ошибка при архивации задачи')
        } finally {
            setUpdatingTaskId(null)
        }
    }

    // группировка задач по статусам
    const todoTasks = tasks.filter(task => task.status === 'todo')
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
    const doneTasks = tasks.filter(task => task.status === 'done')

    if (loading) {
        return <div>Загрузка...</div>
    }

    return (
        <main className='main-page'>
            <div className="main__container">
                <h1 className="main__title">Задачи</h1>
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
                                        <p className="id">ID пользователя: {item.user_id}</p>
                                        <button className="button-block"
                                            onClick={() => handleStatusChange(item.id, 'in-progress')}
                                            disabled={updatingTaskId === item.id}
                                        >
                                            {updatingTaskId === item.id ? 'Обновление...' : 'Взять в работу'}
                                        </button>
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
                                        <p className="id">ID пользователя: {item.user_id}</p>
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
                                        <p className="id">ID пользователя: {item.user_id}</p>
                                        <div className="button-block">
                                            <button
                                                onClick={() => handleStatusChange(item.id, 'in-progress')}
                                                disabled={updatingTaskId === item.id}
                                            >
                                                Вернуть
                                            </button>
                                            <button onClick={() => handleArchiveTask(item.id)}
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