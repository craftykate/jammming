import React, { Component } from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        searchResults: [
          {
            id: 1,
            name: 'Song Name',
            artist: 'Artist Name',
            album: 'Album Name'
          },
          {
            id: 2,
            name: 'Ooh lala',
            artist: 'Lady GooGoo',
            album: `I'm so fancy`
          }
        ],
        playlistName: '',
        playlistTracks: [
          {
            id: 3,
            name: 'A song I like',
            artist: 'Artist #1',
            album: 'Album #1'
          },
          {
            id: 4,
            name: 'Anotha song I like',
            artist: 'Artist #2',
            album: 'Album #2'
          }
        ]
      };
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  addTrack(track) {
    if (!this.state.playlistTracks.filter(listItem => listItem.id === track.id).length > 0) {
      this.setState({
        playlistTracks: [...this.state.playlistTracks, track]
      });
    }
  }

  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(playlistItem => playlistItem.id !== track.id)
    });
  }

  updatePlaylistName(newName) {
    this.setState({
      playlistName: newName
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} onNameChange={this.updatePlaylistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
