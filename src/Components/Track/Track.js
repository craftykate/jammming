import React, { Component } from 'react';
import './Track.css';


export class Track extends Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  // Send track info to addTrack() in App.js
  addTrack() {
    this.props.onAdd(this.props.track);
  }

  // Send track info to removeTrack() in App.js
  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  // Decides whether to display a + or - next to track, along with corresponding method
  // If track has type "playlist", display - link
  // If track has type "searchResults", display + link
  addOrDelete() {
    if (this.props.type === "playlist") {
      return <a className="Track-action" onClick={this.removeTrack}>-</a>
    } else if (this.props.type === "searchResults") {
      return <a className="Track-action" onClick={this.addTrack}>+</a>
    }
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.addOrDelete()}
      </div>
    );
  }
}
