import React, { Component } from 'react';
import './SearchBar.css';


export class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ''
    }
    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
  }

  // update state of searchTerm with every keystroke
  handleTermChange(e) {
    this.setState({
      searchTerm: e.target.value
    })
  }

  // Send search term to search() in App.js
  search() {
    this.props.onSearch(this.state.searchTerm)
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}
