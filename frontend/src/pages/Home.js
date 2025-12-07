import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Home.css';

const API_URL = 'http://localhost:5001/api';

const Home = () => {
  const { user, logout, updateUser } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [activeTab, setActiveTab] = useState('trending');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [toast, setToast] = useState('');

  // Initialize data from user
  useEffect(() => {
    if (user) {
      setFavorites(user.favorites || []);
      setPlaylists(user.playlists || []);
    }
  }, [user]);

  // Load trending songs on mount
  useEffect(() => {
    loadTrendingSongs();
    // eslint-disable-next-line
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const loadTrendingSongs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://v1.nocodeapi.com/bhawana_ydv/spotify/fxxAcPsnsMBcOXtN/search?q=trending%202024&type=track&limit=20`
      );
      const data = await response.json();
      setTrendingTracks(data.tracks?.items?.slice(0, 20) || []);
    } catch (error) {
      console.error('Error loading trending songs:', error);
      showToast('Failed to load trending songs');
    }
    setIsLoading(false);
  };

  const searchTracks = async () => {
    if (!keyword.trim()) return;
    setIsLoading(true);
    setActiveTab('search');
    try {
      const response = await fetch(
        `https://v1.nocodeapi.com/bhawana_ydv/spotify/fxxAcPsnsMBcOXtN/search?q=${encodeURIComponent(keyword)}&type=track&limit=20`
      );
      const data = await response.json();
      setTracks(data.tracks?.items || []);
    } catch (error) {
      console.error('Error searching tracks:', error);
      showToast('Search failed');
    }
    setIsLoading(false);
  };

  // =============== CRUD OPERATIONS ===============

  // CREATE - Add to Favorites
  const addToFavorites = async (track) => {
    try {
      const trackData = {
        trackId: track.id,
        trackName: track.name,
        artistName: track.artists?.[0]?.name || 'Unknown',
        albumImage: track.album?.images?.[0]?.url || '',
        previewUrl: track.preview_url || ''
      };
      const res = await axios.post(`${API_URL}/user/favorites`, trackData);
      setFavorites(res.data.favorites);
      updateUser({ ...user, favorites: res.data.favorites });
      showToast('Added to favorites! ❤️');
    } catch (error) {
      if (error.response?.data?.message === 'Track already in favorites') {
        showToast('Already in favorites!');
      } else {
        console.error('Error adding to favorites:', error);
        showToast('Failed to add to favorites');
      }
    }
  };

  // DELETE - Remove from Favorites
  const removeFromFavorites = async (trackId) => {
    try {
      const res = await axios.delete(`${API_URL}/user/favorites/${trackId}`);
      setFavorites(res.data.favorites);
      updateUser({ ...user, favorites: res.data.favorites });
      showToast('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      showToast('Failed to remove');
    }
  };

  // READ - Check if favorite
  const isFavorite = useCallback((trackId) => {
    return favorites.some(f => f.trackId === trackId);
  }, [favorites]);

  // CREATE - Create Playlist
  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      showToast('Please enter a playlist name');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/user/playlists`, {
        name: newPlaylistName.trim(),
        description: ''
      });
      setPlaylists(res.data.playlists);
      updateUser({ ...user, playlists: res.data.playlists });
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
      showToast('Playlist created! 📁');
    } catch (error) {
      console.error('Error creating playlist:', error);
      showToast('Failed to create playlist');
    }
  };

  // DELETE - Delete Playlist
  const deletePlaylist = async (playlistId) => {
    if (!window.confirm('Delete this playlist?')) return;
    try {
      const res = await axios.delete(`${API_URL}/user/playlists/${playlistId}`);
      setPlaylists(res.data.playlists);
      updateUser({ ...user, playlists: res.data.playlists });
      showToast('Playlist deleted');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      showToast('Failed to delete playlist');
    }
  };

  // CREATE - Add Track to Playlist (to first playlist)
  const addTrackToPlaylist = async (track) => {
    if (playlists.length === 0) {
      showToast('Create a playlist first!');
      setActiveTab('playlists');
      setShowCreatePlaylist(true);
      return;
    }
    
    const playlistId = playlists[0]._id;
    
    try {
      const trackData = {
        trackId: track.id || track.trackId,
        trackName: track.name || track.trackName,
        artistName: track.artists?.[0]?.name || track.artistName || 'Unknown',
        albumImage: track.album?.images?.[0]?.url || track.albumImage || '',
        previewUrl: track.preview_url || track.previewUrl || ''
      };
      
      const res = await axios.post(`${API_URL}/user/playlists/${playlistId}/tracks`, trackData);
      
      const updatedPlaylists = playlists.map(p => 
        p._id === playlistId ? res.data.playlist : p
      );
      setPlaylists(updatedPlaylists);
      updateUser({ ...user, playlists: updatedPlaylists });
      showToast(`Added to "${playlists[0].name}"! 🎵`);
    } catch (error) {
      if (error.response?.data?.message === 'Track already in playlist') {
        showToast('Already in this playlist!');
      } else {
        console.error('Error adding to playlist:', error);
        showToast('Failed to add to playlist');
      }
    }
  };

  // DELETE - Remove Track from Playlist
  const removeTrackFromPlaylist = async (playlistId, trackId) => {
    try {
      const res = await axios.delete(`${API_URL}/user/playlists/${playlistId}/tracks/${trackId}`);
      const updatedPlaylists = playlists.map(p => 
        p._id === playlistId ? res.data.playlist : p
      );
      setPlaylists(updatedPlaylists);
      updateUser({ ...user, playlists: updatedPlaylists });
      showToast('Removed from playlist');
    } catch (error) {
      console.error('Error removing from playlist:', error);
      showToast('Failed to remove');
    }
  };

  // =============== TRACK CARD COMPONENT ===============
  const TrackCard = ({ track, isFromApi = true, playlistId = null }) => {
    const trackId = isFromApi ? track.id : track.trackId;
    const trackName = isFromApi ? track.name : track.trackName;
    const artistName = isFromApi ? (track.artists?.[0]?.name || 'Unknown') : track.artistName;
    const albumImage = isFromApi ? (track.album?.images?.[0]?.url || '') : track.albumImage;
    const previewUrl = isFromApi ? track.preview_url : track.previewUrl;

    return (
      <div className="track-card">
        <div className="track-image">
          {albumImage ? (
            <img src={albumImage} alt={trackName} />
          ) : (
            <div className="no-image">🎵</div>
          )}
          {previewUrl && (
            <button 
              type="button"
              className={`play-button ${currentlyPlaying === trackId ? 'playing' : ''}`}
              onClick={() => setCurrentlyPlaying(currentlyPlaying === trackId ? null : trackId)}
            >
              {currentlyPlaying === trackId ? '⏸' : '▶'}
            </button>
          )}
        </div>
        
        <div className="track-info">
          <h3 className="track-name">{trackName}</h3>
          <p className="artist-name">{artistName}</p>
        </div>
        
        <div className="track-actions">
          {/* Favorite Button - Click to add/remove */}
          <button 
            type="button"
            className={`action-btn ${isFavorite(trackId) ? 'active' : ''}`}
            onClick={() => isFavorite(trackId) ? removeFromFavorites(trackId) : addToFavorites(track)}
            title={isFavorite(trackId) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite(trackId) ? '❤️' : '🤍'}
          </button>

          {/* Playlist Button - Click to add to first playlist */}
          {playlistId ? (
            <button 
              type="button"
              className="action-btn remove-btn"
              onClick={() => removeTrackFromPlaylist(playlistId, trackId)}
              title="Remove from playlist"
            >
              ✕
            </button>
          ) : (
            <button 
              type="button"
              className="action-btn"
              onClick={() => addTrackToPlaylist(track)}
              title={playlists.length > 0 ? `Add to "${playlists[0]?.name}"` : 'Create a playlist first'}
            >
              ➕
            </button>
          )}
        </div>

        {currentlyPlaying === trackId && previewUrl && (
          <audio src={previewUrl} autoPlay onEnded={() => setCurrentlyPlaying(null)} />
        )}
      </div>
    );
  };

  // =============== RENDER ===============
  return (
    <div className="home-container">
      {/* Toast Notification */}
      {toast && <div className="toast-message">{toast}</div>}

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🎵</span>
          <span className="brand-text">Melody</span>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchTracks()}
            placeholder="Search for tracks..."
          />
          <button type="button" onClick={searchTracks} className="search-btn">🔍</button>
        </div>

        <div className="navbar-user">
          <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}</span>
          <button type="button" onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="tabs">
        {['trending', 'search', 'favorites', 'playlists'].map(tab => (
          <button
            key={tab}
            type="button"
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'trending' && '🔥 Trending'}
            {tab === 'search' && '🔍 Search'}
            {tab === 'favorites' && `❤️ Favorites (${favorites.length})`}
            {tab === 'playlists' && `📁 Playlists (${playlists.length})`}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div className="section">
            <div className="section-header">
              <h2>🔥 Top 20 Trending Songs</h2>
              <button type="button" className="refresh-btn" onClick={loadTrendingSongs} disabled={isLoading}>
                {isLoading ? '⏳' : '🔄'} Refresh
              </button>
            </div>
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading...</p>
              </div>
            ) : (
              <div className="tracks-grid">
                {trendingTracks.map((track, i) => (
                  <div key={track.id} className="track-wrapper">
                    <span className="track-rank">#{i + 1}</span>
                    <TrackCard track={track} isFromApi={true} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="section">
            <div className="section-header">
              <h2>🔍 Search Results {keyword && `for "${keyword}"`}</h2>
            </div>
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Searching...</p>
              </div>
            ) : tracks.length > 0 ? (
              <div className="tracks-grid">
                {tracks.map(track => (
                  <TrackCard key={track.id} track={track} isFromApi={true} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h2>Search for music</h2>
                <p>Type in the search bar and press Enter</p>
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="section">
            <div className="section-header">
              <h2>❤️ Your Favorites</h2>
            </div>
            {favorites.length > 0 ? (
              <div className="tracks-grid">
                {favorites.map(track => (
                  <TrackCard key={track.trackId} track={track} isFromApi={false} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">❤️</span>
                <h2>No favorites yet</h2>
                <p>Click the heart on songs to add them here</p>
              </div>
            )}
          </div>
        )}

        {/* Playlists Tab */}
        {activeTab === 'playlists' && (
          <div className="section">
            <div className="section-header">
              <h2>📁 Your Playlists</h2>
              <button 
                type="button" 
                className="create-playlist-btn"
                onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
              >
                ➕ New Playlist
              </button>
            </div>

            {/* Create Playlist Form */}
            {showCreatePlaylist && (
              <div className="create-playlist-form">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
                  autoFocus
                />
                <button type="button" onClick={createPlaylist} className="save-btn">Create</button>
                <button type="button" onClick={() => setShowCreatePlaylist(false)} className="cancel-btn">Cancel</button>
              </div>
            )}

            {/* Playlists List */}
            {playlists.length > 0 ? (
              <div className="playlists-list">
                {playlists.map(playlist => (
                  <div key={playlist._id} className="playlist-item">
                    <div className="playlist-header">
                      <div className="playlist-info">
                        <h3>📁 {playlist.name}</h3>
                        <span className="track-count">{playlist.tracks?.length || 0} tracks</span>
                      </div>
                      <button 
                        type="button"
                        className="delete-playlist-btn"
                        onClick={() => deletePlaylist(playlist._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    
                    {playlist.tracks?.length > 0 ? (
                      <div className="playlist-tracks">
                        {playlist.tracks.map(track => (
                          <TrackCard 
                            key={track.trackId} 
                            track={track} 
                            isFromApi={false}
                            playlistId={playlist._id}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="empty-playlist">
                        No tracks yet. Click ➕ on any song to add it here!
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📁</span>
                <h2>No playlists yet</h2>
                <p>Create a playlist to organize your music</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
