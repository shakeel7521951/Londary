import './App.css';
import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

const MainFunction = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <MainFunction />,
    children: [
      { path: "", element: <Home /> }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
