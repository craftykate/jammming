import React, { Component } from 'react';
import './Track.css';

export class Track extends Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  addOrDelete() {
    if (this.props.type === "playlist") {
      return <a className="Track-action" >-</a>
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
