import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/home.jsx';
import PreviewPage from './Pages/preview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;