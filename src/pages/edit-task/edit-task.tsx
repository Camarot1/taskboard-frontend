import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './edit-task.scss'
import { useTheme } from "../../theme";

interface UpdateData {
    title: string;
    description: string;
}

interface Task {
    id: number;
    user_id: number;
    username: string;
    company_id: number;
    title: string;
    description: string;
    status: string;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export default function EditTask() {
    const {theme} = useTheme()
    const { id } = useParams()
    const [updateData, setUpdateData] = useState<UpdateData>({
        title: '',
        description: ''
    })

    useEffect(() => {
        loadData()
    }, [])


    const loadData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/gettask/${id}`)
            const tasks: Task[] = await response.json()
            if (tasks && tasks.length > 0) {
                const task = tasks[0]
                if (task) {
                    setUpdateData({
                        title: task.title,
                        description: task.description
                    })
                }
            }
        } catch (error) {
            alert(error)
        }
    }

    const change = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const { name, value } = e.target
        setUpdateData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const fetchData = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/patchtask/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            })
            alert('Задача обновленна')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <main className={`editTask-page editTask-page-${theme}`}>
            <div className="main__container">
                <form className="main__form" onSubmit={fetchData}>
                    <div className="form__block">
                        <label>Заголовок</label>
                        <textarea className="textarea-small" value={updateData.title} name="title" onChange={change} />
                    </div>
                    <div className="form__block">
                        <label>Текст</label>
                        <textarea value={updateData.description} name="description" onChange={change} />
                    </div>
                    <button>Обновить</button>
                </form>
            </div>
        </main>
    )
}