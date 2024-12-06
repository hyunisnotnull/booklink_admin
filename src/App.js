import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './pages/include/Header';
import Navbar from './pages/include/Navbar';
import Footer from './pages/include/Footer';
import Home from './pages/Home';
import Signin from './pages/admin/Signin';
import Signup from './pages/admin/Signup';
import Modify from './pages/admin/Modify';
import EventList from './pages/events/EventList';
import EventRegister from './pages/events/RegistEvent';
import EventModifyForm from './pages/events/ModifyEvent';
import Stat from './pages/stats/Stat';

const App = () => {
  return (
    <Router>
      <Header />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/modify" element={<Modify />} />
        <Route path="/event" element={<EventList />} />
        <Route path="/event/register_event_form" element={<EventRegister />} />
        <Route path="/event/modify_event_form/:eventId" element={<EventModifyForm />} />
        <Route path="/stat" element={<Stat />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
