import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/main/main.jsx'

export default function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <main>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}