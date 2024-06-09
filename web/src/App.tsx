import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Chat from "./components/Chat";
import ChatList from "./components/ChatList/ChatList";
import Topbar from "./components/Navigation/TopBar";
import React from "react";
import { ChatPreviewContext } from "./contexts/ChatPreview.context";
import { ChatPreview } from "./interfaces/chat_preview.interface";
import Sidebar from "./components/Navigation/SideBar";
import { SelectedTabProvider } from "./contexts/SelectedTab.context";
import ContactList from "./components/ContactList/ContactList";
import ContactPage from "./components/ContactList/ContactPage";

function App() {
    const [chatPreview, setChatPreview] = React.useState<ChatPreview | null>(
        null
    );

    return (
        <BrowserRouter>
            <div className="flex flex-col h-[100%]">
                <Topbar />
                <SelectedTabProvider>
                    <div className="flex-grow overflow-hidden flex">
                        <div className="grid grid-cols-8 flex-grow">
                            <div className="col-span-1">
                                <Sidebar />
                            </div>
                            <div className="col-span-7 pl-5 flex flex-col h-full">
                                <ChatPreviewContext.Provider
                                    value={{ chatPreview, setChatPreview }}
                                >
                                    <Routes>
                                        <Route
                                            path="/chat/:id"
                                            element={<Chat />}
                                        ></Route>
                                        <Route
                                            path="/list"
                                            element={<ChatList />}
                                        ></Route>
                                        <Route
                                            path="/contacts"
                                            element={<ContactPage />}
                                        ></Route>
                                    </Routes>
                                </ChatPreviewContext.Provider>
                            </div>
                        </div>
                    </div>
                </SelectedTabProvider>
            </div>
        </BrowserRouter>
    );
}

export default App;
