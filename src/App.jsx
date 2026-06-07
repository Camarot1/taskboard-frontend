import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/main/main.jsx'
import LoginPage from './pages/login/login.jsx'
import AddPage from './pages/addTask/addTask.jsx'
import Header from './pages/components/header.jsx'
export default function App() {
    return (
        <BrowserRouter>
            <div className="App">
                    <Header/>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/addTask" element={<AddPage />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
            </div>
        </BrowserRouter>
    )
}