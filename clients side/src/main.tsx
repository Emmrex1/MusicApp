import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SongAlbumProvider } from './context/songcontext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <SongAlbumProvider>  
          <App />
      </SongAlbumProvider>
    
  </StrictMode>,
)
