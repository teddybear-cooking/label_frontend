import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LabelingInterface from './components/LabelingInterface';
import AdminInterface from './components/AdminInterface';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LabelingInterface />} />
            <Route path="/label" element={<LabelingInterface />} />
            <Route path="/admin" element={<AdminInterface />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
