import { useState } from "react";
import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Chat from "./components/MessagePane";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <BrowserRouter>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Chat id={338} />}></Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    );
}

export default App;
