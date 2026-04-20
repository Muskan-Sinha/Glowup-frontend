import Login from "./auth/Login.jsx"
import Signup from "./auth/Signup.jsx"
import Dashboard from "./Hero/Dashboard.jsx"
import Home from "./Hero/Home.jsx"
import MoodTracker from "./MoodTracker/MoodTracker.jsx"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute.jsx"
import { fetchCurrentUser } from "./services/auth/UserThunk.jsx"; 
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import HabitTracker from "./HabitTracker/HabitTracker.jsx"
import Goals from "./Goals/Goals.jsx"
import Journal from "./Journal/Journal.jsx"

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/moodtracker" element={<MoodTracker />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/journal" element={<Journal />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App