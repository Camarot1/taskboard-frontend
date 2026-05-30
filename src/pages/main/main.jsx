import React, { useState, useEffect } from "react"
import './main.scss'
export default function MainPage() {

    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState([])
    const [updatingTaskId, setUpdatingTaskId] = useState(null)

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
            
            setTasks(prevTasks =>  prevTasks.map(task => task.id === taskId  ? updatedTask : task ) )
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Ошибка при обновлении статуса')
        } finally {
            setUpdatingTaskId(null)
        }
    }

    const handleArchiveTask = async (taskId) => {
        setUpdatingTaskId(taskId)
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/done/${taskId}`, {
                method: 'Post',
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
        <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
            <div style={{ flex: 1 }}>
                <h2>To-Do</h2>
                {todoTasks.length === 0 ? (
                    <div>Нет задач</div>
                ) : (
                    todoTasks.map(item => (
                        <div key={item.id}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <p>ID пользователя: {item.user_id}</p>
                            <button 
                                onClick={() => handleStatusChange(item.id, 'in-progress')}
                                disabled={updatingTaskId === item.id}
                            >
                                {updatingTaskId === item.id ? 'Обновление...' : 'Взять в работу'}
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div style={{ flex: 1 }}>
                <h2>In Progress</h2>
                {inProgressTasks.length === 0 ? (
                    <div>Нет задач</div>
                ) : (
                    inProgressTasks.map(item => (
                        <div key={item.id}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <p>ID пользователя: {item.user_id}</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
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

            <div style={{ flex: 1 }}>
                <h2>Done</h2>
                {doneTasks.length === 0 ? (
                    <div>Нет задач</div>
                ) : (
                    doneTasks.map(item => (
                        <div key={item.id}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <p>ID пользователя: {item.user_id}</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
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
                )}
            </div>
        </div>
    )
}