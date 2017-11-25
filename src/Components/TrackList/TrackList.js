import React, { Component } from 'react';
import './TrackList.css';
import { Track } from '../Track/Track';

export class TrackList extends Component {
  render() {
    return (
      <div className="TrackList">
        {/* Later this will pass a unique id down as the key */}
        {this.props.tracks.map(track => <Track key={track.id} track={track} />)}
      </div>
    );
  }
}
