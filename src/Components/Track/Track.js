import React, { Component } from 'react';
import './Track.css';

export class Track extends Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

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
        {console.log(this.props.track.name, this.props.track.id)}
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.addOrDelete()}
      </div>
    );
  }
}
