import React, { Component } from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        searchResults: [],
        playlistName: '',
        playlistTracks: []
      };
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
  }

  // Add track to playlist if it's not already in it
  addTrack(track) {
    if (!this.state.playlistTracks.filter(listItem => listItem.id === track.id).length > 0) {
      this.setState({
        playlistTracks: [...this.state.playlistTracks, track]
      });
    }
  }

  // Remove track from playlist
  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(playlistItem => playlistItem.id !== track.id)
    });
  }

  // Update name of playlist
  updatePlaylistName(newName) {
    this.setState({
      playlistName: newName
    });
  }

  // Save playlist to Spotify
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: '',
        searchResults: [],
        playlistTracks: []
      });
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      this.setState({
        searchResults: tracks
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
          />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              onNameChange={this.updatePlaylistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
