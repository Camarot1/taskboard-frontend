import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TasksPage from './pages/tasks/tasks.tsx'
import LoginPage from './pages/login/login.tsx'
import AddPage from './pages/addTask/addTask.tsx'
import MainPage from './pages/main.jsx'
import EditTask from './pages/edit-task/edit-task.tsx'
import RegisterPage from './pages/register/register.tsx'
import Header from './pages/components/header.tsx'
import { Theme } from './theme'
export default function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Theme>
                    <Header />
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/addTask" element={<AddPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/edit-task/:id" element={<EditTask />} />
                    </Routes>
                </Theme>
            </div>
        </BrowserRouter >
    )
}