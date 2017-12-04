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

  // If the component mounts, that means the page was refreshed to get accessToken
  // If this is the case, the input value will erase which it doesn't do on subsequent searches
  // To maintain continuity, put the search term back into the input area
  componentDidMount() {
    window.document.getElementById("searchInput").value=sessionStorage.getItem("inputTerm");
  }

  // update state of searchTerm with every keystroke
  handleTermChange(e) {
    this.setState({
      searchTerm: e.target.value
    })
  }

  // Send search term to search() in App.js
  search() {
    // save the search term to session storage in case page gets refreshed
    sessionStorage.setItem("inputTerm", this.state.searchTerm);
    this.props.onSearch(this.state.searchTerm)
  }

  render() {
    return (
      <div className="SearchBar">
        <input id="searchInput" placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}
