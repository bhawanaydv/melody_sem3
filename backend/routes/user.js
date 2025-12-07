const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/user/favorites
// @desc    Add track to favorites
// @access  Private
router.post('/favorites', auth, async (req, res) => {
  try {
    const { trackId, trackName, artistName, albumImage, previewUrl } = req.body;
    
    const user = await User.findById(req.user._id);
    
  
    const exists = user.favorites.find(f => f.trackId === trackId);
    if (exists) {
      return res.status(400).json({ message: 'Track already in favorites' });
    }
    
    user.favorites.push({ trackId, trackName, artistName, albumImage, previewUrl });
    await user.save();
    
    res.json({ message: 'Track added to favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/favorites/:trackId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(f => f.trackId !== req.params.trackId);
    await user.save();
    
    res.json({ message: 'Track removed from favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/playlists', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }
    
    const user = await User.findById(req.user._id);
    user.playlists.push({ name, description, tracks: [] });
    await user.save();
    
    res.status(201).json({ message: 'Playlist created', playlists: user.playlists });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/playlists', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ playlists: user.playlists });
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/playlists/:playlistId', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = await User.findById(req.user._id);
    
    const playlist = user.playlists.id(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    
    await user.save();
    res.json({ message: 'Playlist updated', playlist });
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/playlists/:playlistId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.playlists = user.playlists.filter(p => p._id.toString() !== req.params.playlistId);
    await user.save();
    
    res.json({ message: 'Playlist deleted', playlists: user.playlists });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/playlists/:playlistId/tracks', auth, async (req, res) => {
  try {
    const { trackId, trackName, artistName, albumImage, previewUrl } = req.body;
    const user = await User.findById(req.user._id);
    
    const playlist = user.playlists.id(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
  
    const exists = playlist.tracks.find(t => t.trackId === trackId);
    if (exists) {
      return res.status(400).json({ message: 'Track already in playlist' });
    }
    
    playlist.tracks.push({ trackId, trackName, artistName, albumImage, previewUrl });
    await user.save();
    
    res.json({ message: 'Track added to playlist', playlist });
  } catch (error) {
    console.error('Add track to playlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/playlists/:playlistId/tracks/:trackId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const playlist = user.playlists.id(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    playlist.tracks = playlist.tracks.filter(t => t.trackId !== req.params.trackId);
    await user.save();
    
    res.json({ message: 'Track removed from playlist', playlist });
  } catch (error) {
    console.error('Remove track from playlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    
    await user.save();
    
    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
