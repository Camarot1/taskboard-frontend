import React, { useState, useEffect } from "react"
import './tasks.scss'
import { useNavigate } from 'react-router-dom'
import { usersData, deleteToken, getToken } from '../token'
import { useTheme } from "../../theme"

interface Task {
    id: number;
    user_id: number;
    username: string;
    company_id: number;
    title: string;
    description: string;
    status: string;
    checker_username: string;
    display_order: number;
    deadline: string;
    created_at: string;
    updated_at: string;
}
interface UserData {
    id: number;
    login: string;
}

interface UserCompanies {
    id: number;
    name: string;
}

interface TaskProps {
    title: string;
    description: string;
    username: string
    created_at: string;
    deadline: string;
    checker_username?: string | null
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function TasksPage() {
    const { theme } = useTheme()
    const [loading, setLoading] = useState<boolean>(true)
    const [tasks, setTasks] = useState<Task[]>([])
    const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null)
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null)
    const [companies, setCompanies] = useState<UserCompanies[]>([])
    const [selectedCompany, setSelectedCompany] = useState<string>('')

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

    const fetchTask = async (userId: number): Promise<void> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/${userId}`)
            const data: Task[] = await response.json()
            setTasks(data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleStatusChange = async (taskId: number, newStatus: string): Promise<void> => {
        setUpdatingTaskId(taskId)
        if (!userData) {
            throw new Error('Not userData')
        }
        try {
            if (newStatus === 'in-progress') {
                const token = getToken()

                await fetch(
                    `${process.env.REACT_APP_URL}/tasks/uncheck/${taskId}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                )
            }

            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/patch/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus, user_id: userData.id, username: userData.login })
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

    const handleArchiveTask = async (taskId: number): Promise<void> => {
        if (!window.confirm(`Вы уверены, что хотите отправить задачу в архив?`)) {
            return;
        }

        setUpdatingTaskId(taskId)
        try {
            if (!userData) {
                throw new Error('Not userData')
            }
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/done/${taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: userData.login })
            })

            if (!response.ok) {
                throw new Error('Ошибка при архивации задачи')
            }

            alert('Задача успешно отправлена в архив!')

            if (selectedCompany === 'my-tasks' || !selectedCompany) {
                await fetchTask(userData.id)
            } else {
                await takeTask(selectedCompany)
            }
        } catch (error) {
            console.error('Error archiving task:', error)
            alert('Ошибка при архивации задачи')
        } finally {
            setUpdatingTaskId(null)
        }
    }

    const redirectEdit = async (item: number): Promise<void> => {
        try {
            navigate(`/edit-task/${item}`)
        } catch (error) {
            alert(error)
        }
    }

    const todoTasks = tasks.filter(task => task.status === 'todo')
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
    const check = tasks.filter(task => task.status === 'check')
    const doneTasks = tasks.filter(task => task.status === 'done')


    useEffect(() => {
        if (userData) {
            loadCompanies()
        }
    }, [userData])

    const loadCompanies = async (): Promise<void> => {
        if (!userData) {
            throw new Error('no UserData')
        }
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

    const selectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = e.target.value
        setSelectedCompany(value)
        if (value === 'my-tasks') {
            if (userData) {
                fetchTask(userData.id)
            }
        } else if (value) {
            takeTask(value)
        } else {
            setTasks([])
        }

    }

    const takeTask = async (id: string): Promise<void> => {
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

    const takeCheck = async (taskId: number): Promise<void> => {
        if (!window.confirm("Вы уверенны что хотите взять задачу на проверку?")) {
            return
        }

        try {
            if (!userData) {
                throw new Error("Not userdata")
            }

            const token = getToken()

            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/check/${taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Ошибка при архивации задачи')
            }

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId
                        ? { ...task, checker_username: userData.login }
                        : task
                )
            )

        } catch (error) {
            console.log(error)
            alert("Ошибка при взятии задачи на проверку")
        }
    }



    if (loading) {
        return <div>Загрузка...</div>
    }

    function TaskCard({ title, description, username, created_at, deadline, checker_username }: TaskProps) {
        return (
            <div className="props">
                <p className="title">{title}</p>
                <p className="desc">{description}</p>
                <p className="name">Имя добавившего: {username}</p>
                <p className="created_at">Создано: {formatDate(created_at)}</p>
                <p className="created_at">Задача до: {formatDate(deadline)}</p>
                {checker_username && <p className="name">Проверяющий : {checker_username || 'Проверяющего нет'}</p>}
            </div>
        )
    }

    return (
        <main className={`main-page tasks-page-${theme}`}>
            <div className="main__container">
                <h1 className="main__title">Задачи</h1>
                <div className="main__nick">Ваш никнейм: {userData?.login}</div>
                <select className="main__select" onChange={selectChange} name="" id="company-select">
                    <option value="my-tasks">Взято вами</option>
                    {companies.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <button className="main__button" onClick={() => {
                    if (!window.confirm(`Вы уверены, что хотите выйти?`)) {
                        return;
                    }
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
                                <div style={{ color: theme === "white" ? 'black' : 'white' }}>Нет задач</div>
                            ) : (
                                todoTasks.map(item => (
                                    <div className="task" key={item.id}>
                                        <TaskCard title={item.title} description={item.description} username={item.username} created_at={item.created_at} deadline={item.deadline} />
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
                                <div style={{ color: theme === "white" ? 'black' : 'white' }}>Нет задач</div>
                            ) : (
                                inProgressTasks.map(item => (
                                    <div className="task" key={item.id}>
                                        <TaskCard title={item.title} description={item.description} username={item.username} created_at={item.created_at} deadline={item.deadline} />
                                        <div className="button-block">
                                            <button
                                                onClick={() => handleStatusChange(item.id, 'todo')}
                                                disabled={updatingTaskId === item.id}
                                            >
                                                Назад
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(item.id, 'check')}
                                                disabled={updatingTaskId === item.id}
                                            >
                                                Отправить на проверку
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="tasks__column">
                        <p className="column__title">Check</p>
                        <div className="tasks">
                            {check.length === 0 ? (
                               <div style={{ color: theme === "white" ? 'black' : 'white' }}>Нет задач</div>
                            ) : (
                                check.map(item => (
                                    <div className="task" key={item.id}>
                                        <TaskCard title={item.title} description={item.description} username={item.username} created_at={item.created_at} checker_username={item.checker_username} deadline={item.deadline} />
                                        <button
                                            className="button-block"
                                            onClick={() => takeCheck(item.id)}>
                                            Стать проверяющим</button>
                                        <button
                                            onClick={() => handleStatusChange(item.id, 'in-progress')}
                                            disabled={updatingTaskId === item.id}
                                        >
                                            На доработку
                                        </button>
                                        <button className="button-block red" onClick={() => redirectEdit(item.id)}>
                                            Редактировать текст задачи
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(item.id, 'done')}
                                            disabled={updatingTaskId === item.id}
                                        >
                                            Завершить
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="tasks__column">
                        <p className="column__title">Done</p>
                        <div className="tasks">
                            {doneTasks.length === 0 ? (
                                <div style={{ color: theme === "white" ? 'black' : 'white' }}>Нет задач</div>
                            ) : (

                                doneTasks.map(item => (
                                    <div className="task" key={item.id}>
                                        <TaskCard title={item.title} description={item.description} username={item.username} created_at={item.created_at} checker_username={item.checker_username} deadline={item.deadline} />
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