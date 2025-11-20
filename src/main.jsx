import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Router from './Router/Router.jsx'
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './Pages/Auth/UserContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider>
            <ToastContainer 
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <Router />
        </UserProvider>
    </StrictMode>,
)
