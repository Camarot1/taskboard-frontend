import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './edit-task.scss'

export default function EditTask() {
    const { id } = useParams()
    const [updateData, setUpdateData] = useState({
        title: '',
        description: ''
    })

    useEffect(() => {
        loadData()
    }, [])


    const loadData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/tasks/gettask/${id}`)
            const res = await response.json()
            const task = res.message[0]
            setUpdateData({
                title: task.title,
                description: task.description
            })
        } catch (error) {
            alert(error)
        }
    }

    const change = (e) => {
        const { name, value } = e.target
        setUpdateData(prev => ({
            ...updateData,
            [name]: value
        }))
    }

    const fetchData = async (e) => {
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
        <main className="editTask-page">
            <div className="main__container">
                <form className="main__form" onSubmit={fetchData}>
                    <div className="form__block">
                        <label>Заголовок</label>
                        <textarea className="textarea-small" type="text" value={updateData.title} name="title" onChange={change}/>
                    </div>
                    <div className="form__block">
                        <label>Текст</label>
                        <textarea type="text" value={updateData.description} name="description" onChange={change}/>
                    </div>
                    <button>Обновить</button>
                </form>
            </div>
        </main>
    )
}