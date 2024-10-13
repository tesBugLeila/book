import './App.css';
import Menu from './components/Menu';
import Home from './components/Home';
import About from './components/About';
import Products from './components/Products';
import Review from './components/Review';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByToken } from "./redux/authSlice"; 
import AdminDashboard from './components/admin/AdminDashboard'; 

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [isAdminOpen, setIsAdminOpen] = useState(false); 

  useEffect(() => {
    if (token) {
      dispatch(fetchUserByToken()); 
    }
  }, [dispatch, token]);

  const toggleAdminPanel = () => {
    setIsAdminOpen(prev => !prev); 
  };

  return (
    <div className="App">
      <Menu toggleAdminPanel={toggleAdminPanel} /> 
      {isAdminOpen && <AdminDashboard closeAdminPanel={toggleAdminPanel} />} 
    
      <SideMenu />
      <div id='content'>
          <Home />
        
        <About />
        <Products />
        <Review />
        <Contact />
       
      </div>
      <Footer />
    </div>
  );
}

export default App;
