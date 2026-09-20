import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ParkingList from "./pages/ParkingList";
import ParkingDetails from "./pages/ParkingDetails";
import Booking from "./pages/MyBookings";
import MyBookingsList from "./pages/MyBookingsList";

import GenerateOTP from "./pages/GenerateOTP";
import VerifyOTP from "./pages/VerifyOTP";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";

import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerParking from "./pages/OwnerParking";
import OwnerBookings from "./pages/OwnerBookings";

import GovernmentDashboard from "./pages/GovernmentDashboard";
import About from "./pages/About";

import Logout from "./pages/Logout";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Parking */}
                <Route
                    path="/parking"
                    element={<ParkingList />}
                />

                <Route
                    path="/parking/:id"
                    element={<ParkingDetails />}
                />

                {/* User Booking */}
                <Route
                    path="/booking/:id"
                    element={<Booking />}
                />

                <Route
                    path="/my-bookings"
                    element={<MyBookingsList />}
                />

                {/* OTP */}
                <Route
                    path="/generate-otp/:id"
                    element={<GenerateOTP />}
                />

                <Route
                    path="/verify-otp/:id"
                    element={<VerifyOTP />}
                />

                {/* Check In / Out */}
                <Route
                    path="/check-in/:id"
                    element={<CheckIn />}
                />

                <Route
                    path="/check-out/:id"
                    element={<CheckOut />}
                />

                {/* Owner */}
                <Route
                    path="/owner-dashboard"
                    element={<OwnerDashboard />}
                />

                <Route
                    path="/owner-parking"
                    element={<OwnerParking />}
                />

                <Route
                    path="/owner-bookings"
                    element={<OwnerBookings />}
                />

                {/* Government */}
                <Route
                    path="/government-dashboard"
                    element={<GovernmentDashboard />}
                />

                {/* Logout */}
                <Route
                    path="/logout"
                    element={<Logout />}
                />
                <Route path="/about" element={<About />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;