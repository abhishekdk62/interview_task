import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProfile, createNewProfile, fetchAllProfiles } from '../redux/slices/profileSlice';
import { fetchEventsByProfile } from '../redux/slices/eventSlice';
import './ProfileSelector.css';

const ProfileSelector = () => {
  const dispatch = useDispatch();
  const { profiles=[], selectedProfile, loading } = useSelector((state) => state.profiles);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProfileName, setNewProfileName] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllProfiles());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProfile = (profile) => {
    dispatch(setSelectedProfile(profile));
    dispatch(fetchEventsByProfile(profile._id));
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAddProfile = async () => {
    if (newProfileName.trim()) {
      await dispatch(createNewProfile(newProfileName.trim()));
      setNewProfileName('');
    }
  };

  const filteredProfiles = (profiles).filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="profile-selector" ref={dropdownRef}>
      <div className="profile-selector-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedProfile ? selectedProfile.name : 'Select current profile...'}</span>
        <svg
          className={`chevron ${isOpen ? 'open' : ''}`}
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="profile-list">
            {filteredProfiles.map((profile) => (
              <div
                key={profile._id}
                className={`profile-item ${selectedProfile?._id === profile._id ? 'selected' : ''}`}
                onClick={() => handleSelectProfile(profile)}
              >
                {profile.name}
              </div>
            ))}
          </div>

          <div className="add-profile-section">
            <input
              type="text"
              placeholder="New profile name..."
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddProfile()}
            />
            <button
              className="add-profile-btn"
              onClick={handleAddProfile}
              disabled={!newProfileName.trim() || loading}
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
