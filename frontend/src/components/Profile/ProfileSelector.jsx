import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedProfile,
  createNewProfile,
  fetchAllProfiles,
  clearError,
} from "../../redux/slices/profileSlice";
import { fetchEventsByProfile } from "../../redux/slices/eventSlice";
import "./ProfileSelector.css";
import toast from "react-hot-toast";
import { debounce } from "../../utils/debounce";


const ProfileSelector = () => {
  const dispatch = useDispatch();
  const {
    profiles = [],
    selectedProfile,
    loading,
    error,
  } = useSelector((state) => state.profiles);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProfileName, setNewProfileName] = useState("");
  const dropdownRef = useRef(null);

  const debouncedFetchProfiles = useMemo(
    () =>
      debounce((query) => {
        dispatch(fetchAllProfiles(query));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchAllProfiles(""));
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProfile = (profile) => {
    dispatch(setSelectedProfile(profile));
    dispatch(fetchEventsByProfile(profile._id));
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        icon: "❌",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddProfile = async () => {
    if (newProfileName.trim()) {
      const result = await dispatch(createNewProfile(newProfileName.trim()));
      if (result.type === "profiles/create/fulfilled") {
        toast.success(`Profile "${newProfileName}" created!`);
        setNewProfileName("");
        dispatch(fetchAllProfiles(searchTerm));
      }
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchProfiles(value); 
  };

  return (
    <div className="profile-selector" ref={dropdownRef}>
      <div
        className="profile-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedProfile ? selectedProfile.name : "Select current profile..."}
        </span>
        <svg
          className={`chevron ${isOpen ? "open" : ""}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {loading && <span className="search-loader"></span>}
          </div>

          <div className="profile-list">
            {profiles.length === 0 && !loading ? (
              <div className="no-profiles">No profiles found</div>
            ) : (
              profiles.map((profile) => (
                <div
                  key={profile._id}
                  className={`profile-item ${
                    selectedProfile?._id === profile._id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectProfile(profile)}
                >
                  {profile.name}
                </div>
              ))
            )}
          </div>

          <div className="add-profile-section">
            <input
              type="text"
              placeholder="New profile name..."
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddProfile()}
            />
            <button
              className="add-profile-btn"
              onClick={handleAddProfile}
              disabled={
                !newProfileName.trim() ||
                loading ||
                newProfileName.trim().length < 3
              }
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3.33334V12.6667M3.33334 8H12.6667"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
