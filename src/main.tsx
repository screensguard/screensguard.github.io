import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Font Awesome configuration
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faLaptopCode, 
  faMagnifyingGlass, 
  faLock, 
  faGears, 
  faShieldHalved 
} from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(
  faLaptopCode, 
  faMagnifyingGlass, 
  faLock, 
  faGears, 
  faShieldHalved
)

createRoot(document.getElementById("root")!).render(<App />);
