import { BrowserRouter } from 'react-router-dom';
import './global.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;