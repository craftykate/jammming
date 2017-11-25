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
            name: 'Song Name',
            artist: 'Artist Name',
            album: 'Album Name'
          },
          {
            name: 'Ooh lala',
            artist: 'Lady GooGoo',
            album: `I'm so fancy`
          }
        ],
        playlistName: 'Mah Playlist',
        playlistTracks: [
          {
            name: 'A song I like',
            artist: 'Artist #1',
            album: 'Album #1'
          },
          {
            name: 'Anotha song I like',
            artist: 'Artist #2',
            album: 'Album #2'
          }
        ]
      };
      this.addTrack = this.addTrack.bind(this);
  }

  addTrack(track) {
    //This is supposed to have an "if" statement to see if track.id is already in playlist, but playlist tracks don't have id's yet... TOFIX
    this.setState({
      playlistTracks: [...this.state.playlistTracks, track]
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
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
