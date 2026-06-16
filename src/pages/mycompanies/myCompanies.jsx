import React, { useEffect, useState } from "react";
import './myCompanies.scss'
import { usersData } from '../token'
import { useNavigate } from "react-router-dom";
export default function MyCompanies() {
    const [companies, setCompanies] = useState([])
    const [tasks, setTasks] = useState([])
    const [userData, setUserData] = useState(null)
    const [selectedCompany, setSelectedCompany] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const userDataFromToken = usersData()
        if (!userDataFromToken) {
            navigate('/login')
        }
        setUserData(userDataFromToken)
    }, [])

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
            console.log(data)
            setCompanies(data)
        } catch (error) {
            alert(error)
        }
    }

    const selectChange = (e) => {
        const companyId = e.target.value
        setSelectedCompany(companyId)
        takeTask(companyId)
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

    return (
        <main className="mycompanies-page">
            <div className="main__container">
                <select onChange={selectChange} name="" id="company-select">
                    <option value="">Выберите компанию</option>
                    {companies.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                {tasks && <div className="main__tasks">
                    {tasks.map(item => (
                        <div key={item.id}>
                            <p>{item.username}</p>
                            <p>{item.title}</p>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
                }
            </div>
        </main>
    )
}