import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createNewProfile, fetchAllProfiles } from "../redux/slices/profileSlice";
import { debounce } from "../utils/debounce";


const ProfileDropdown = ({
  profiles,
  selectedProfiles,
  onProfileToggle,
  profileLoading,
}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [newProfileName, setNewProfileName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced backend search - 500ms for API calls
  const debouncedBackendSearch = useMemo(
    () =>
      debounce(async (query) => {
        setIsSearching(true);
        try {
          await dispatch(fetchAllProfiles(query));
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      }, 500),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedBackendSearch(value); // Backend API call
  };

  const handleAddProfile = useCallback(async () => {
    if (newProfileName.trim()) {
      const result = await dispatch(createNewProfile(newProfileName.trim()));
      if (result.type === "profiles/create/fulfilled") {
        toast.success(`Profile "${newProfileName}" created!`);
        setNewProfileName("");
        // Refresh the list after adding
        dispatch(fetchAllProfiles(searchTerm));
      }
    }
  }, [newProfileName, searchTerm, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="form-group">
      <label>Profiles</label>
      <div className="custom-dropdown" ref={dropdownRef}>
        <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
          <span>
            {selectedProfiles.size === 0
              ? "Select profiles..."
              : `${selectedProfiles.size} profile${
                  selectedProfiles.size > 1 ? "s" : ""
                } selected`}
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
          <div className="dropdown-menu">
            <div className="dropdown-list">
              <div className="profile-search">
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {isSearching && (
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    Searching...
                  </span>
                )}
              </div>

              {profiles.length === 0 ? (
                <div
                  style={{
                    padding: "12px 16px",
                    color: "#9ca3af",
                    fontSize: "14px",
                  }}
                >
                  {isSearching ? "Searching..." : "No profiles available"}
                </div>
              ) : (
                profiles.map((profile) => (
                  <label key={profile._id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedProfiles.has(profile._id)}
                      onChange={() => onProfileToggle(profile._id)}
                    />
                    <span>{profile.name}</span>
                  </label>
                ))
              )}
            </div>

            <div className="add-profile-inline">
              <input
                type="text"
                placeholder="Add new profile..."
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddProfile())
                }
              />
              <button
                type="button"
                className="add-btn-inline"
                onClick={handleAddProfile}
                disabled={
                  !newProfileName.trim() ||
                  profileLoading ||
                  newProfileName.trim().length < 2
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
    </div>
  );
};

export default ProfileDropdown;
