import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './comp/Header';
import Navbar from './comp/Navbar';
import Footer from './comp/Footer';
import Home from './pages/Home';
import EventList from './pages/events/EventList';
import EventRegister from './pages/events/RegistEvent';
import EventModifyForm from './pages/events/ModifyEvent';

const App = () => {
  return (
    <Router>
      <Header />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event" element={<EventList />} />
        <Route path="/event/register_event_form" element={<EventRegister />} />
        <Route path="/event/modify_event_form/:eventId" element={<EventModifyForm />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
