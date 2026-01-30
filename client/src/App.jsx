import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArabianHorseHome from './components/ArabianHorseHome';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import ForgotPassword from './components/ForgotPassword';
import VerifyEmail from './components/VerifyEmail';
import ResetPassword from './components/ResetPassword';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Sales from './components/Sales';
import AddHorse from './components/AddHorse';
import HorseList from './components/HorseList';
import HorseProfile from './components/HorseProfile';
import News from './components/News';
import NewsDetails from './components/NewsDetails';
import CreateNews from './components/CreateNews';
import ClassifyHorse from './components/ClassifyHorse';
import JoinUs from './components/JoinUs';
import Auctions from './components/Auctions';
import ContactSeller from './components/ContactSeller';
import UserMessages from './components/UserMessages';
import AuctionDetails from './components/AuctionDetails';
import CreateAuction from './components/CreateAuction';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ArabianHorseHome />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/add-horse" element={<AddHorse />} />
                <Route path="/horses" element={<HorseList />} />
                <Route path="/horse/:id" element={<HorseProfile />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetails />} />
                <Route path="/news/create" element={<CreateNews />} />
                <Route path="/classify" element={<ClassifyHorse />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/join" element={<JoinUs />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/auction/:id" element={<AuctionDetails />} />
                <Route path="/auction/create" element={<CreateAuction />} />
                <Route path="/contact-seller/:horseId" element={<ContactSeller />} />
                <Route path="/messages" element={<UserMessages />} />
            </Routes>
        </Router>
    );
}

export default App;
