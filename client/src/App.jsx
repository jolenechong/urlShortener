import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/notfound";
import Home from "./pages/home";

function App() {
  

  return (
    <>
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;