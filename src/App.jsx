import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/main/main.jsx'
import AddPage from './pages/addTask/addTask.jsx'

export default function App() {
    return (
        <BrowserRouter>
            <div className="App">

                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/addTask" element={<AddPage />} />
                    </Routes>

            </div>
        </BrowserRouter>
    )
}