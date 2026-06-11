import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TasksPage from './pages/tasks/tasks.jsx'
import LoginPage from './pages/login/login.jsx'
import AddPage from './pages/addTask/addTask.jsx'
import MainPage from './pages/main.jsx'
import RegisterPage from './pages/register/register.jsx'
import Header from './pages/components/header.jsx'
export default function App() {
    return (
        <BrowserRouter>
            <div className="App">
                    <Header/>
                    <Routes>
                        <Route path="/" element = {<MainPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/addTask" element={<AddPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Routes>
            </div>
        </BrowserRouter>
    )
}