import React, { Component } from "react";
import "./SearchBar.css";

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = { term: "" };

    console.log(this.props);
  }

  render() {
    return (
      <div className="search-bar">
        <input
          value={this.state.term}
          onChange={event => this.onInputChange(event.target.value)}
          placeholder="Search non-profit organizations..."
        />
      </div>
    );
  }

  onInputChange(term) {
    this.setState({ term });
    console.log(this.props);
    this.props.onSearchTermChange(term);
  }
}

export default SearchBar;
