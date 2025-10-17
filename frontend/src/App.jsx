import React from "react";
import ProfileSelector from "./components/ProfileSelector";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="app-header">
        <div className="header-left">
          <h1>Event Management</h1>
          <p>Create and manage events across multiple timezones</p>
        </div>
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
