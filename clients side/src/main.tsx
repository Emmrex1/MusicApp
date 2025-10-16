import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SongAlbumProvider } from './context/songcontext.tsx'
import { UserProvider } from './context/Usercontext.tsx'
import { Toaster } from 'sonner'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
       <SongAlbumProvider>  
          <App />
           <Toaster /> 
      </SongAlbumProvider>
    </UserProvider>
     
    
  </StrictMode>,
)
