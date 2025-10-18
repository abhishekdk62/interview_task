import  { useState } from "react";

import "./App.css";
import EventForm from "./components/Create/EventForm";
import EventList from "./components/View/EventList";
import ProfileSelector from "./components/Profile/ProfileSelector";

function App() {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-left">
          <h1>Event Management</h1>
          <p>Create and manage events across multiple timezones</p>
        </div>

        
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "dark" ? (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3V1M10 19V17M17 10H19M1 10H3M15.657 4.343L17.071 2.929M2.929 17.071L4.343 15.657M15.657 15.657L17.071 17.071M2.929 2.929L4.343 4.343"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
              Light Mode
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M17 10.5C16.1 13.9 13 16.5 9.5 16.5C5.4 16.5 2 13.1 2 9C2 5.5 4.6 2.4 8 1.5C4.5 3.4 3 7.8 5 11.3C7 14.8 11.4 16.3 14.9 14.3C15.7 13.8 16.4 13.1 17 12.3V10.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Dark Mode
            </>
          )}
        </button>
        <div className="header-right">
          <ProfileSelector />
        </div>
      </div>
      <div className="app-content">
        <div className="left-section">
          <EventForm />
        </div>
        <div className="right-section">
          <EventList />
        </div>
      </div>
    </div>
  );
}

export default App;
