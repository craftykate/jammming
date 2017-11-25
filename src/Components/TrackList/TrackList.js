import React, { Component } from 'react';
import './TrackList.css';
import { Track } from '../Track/Track';

export class TrackList extends Component {
  render() {
    return (
      <div className="TrackList">
        {/* Later this will pass a unique id down as the key TOFIX */}
        {this.props.tracks.map(track => <Track key={track.id} track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} type={this.props.type}/>)}
      </div>
    );
  }
}
