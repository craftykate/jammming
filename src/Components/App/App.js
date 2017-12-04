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
        playlistName: 'New Playlist',
        playlistTracks: []
      };
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
  }

  // If the component mounts, check to see if the url has the accessToken in it
  // If so, that means the page was refreshed to grab the accessToken and the search wasn't carried through
  // Rather than make the user enter their search term again,
  // run the search again with the search term saved in the session storage
  componentDidMount() {
    const checkWindow = window.location.href.match(/access_token=([^&]*)/);
    if (checkWindow !== null) {
      this.search(sessionStorage.getItem("inputSearch"));
    }
  }

  // Add track to playlist if it's not already in it
  addTrack(track) {
    // Only add track to playlist if playlist doesn't already contain that track
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

  // Save playlist to Spotify:
  // Gather track URIs into an array,
  // Send playlist name and array of tracks to Spotify.savePlaylist()
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      // Reset searchResults and Playlist's tracks and name
      this.setState({
        playlistName: 'New Playlist',
        searchResults: [],
        playlistTracks: []
      });
    });
  }

  // Send search term to Spotify.search() which will return an array of tracks
  search(searchTerm) {
    // save the search to session storage in case the page needs to get refreshed
    sessionStorage.setItem("inputSearch", searchTerm);
    Spotify.search(searchTerm).then(tracks => {
      // Add array of tracks to this.state.searchResults and rerender
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
