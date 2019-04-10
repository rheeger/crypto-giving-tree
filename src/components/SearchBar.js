import React, { Component } from 'react';

class SearchBar extends Component {
	constructor(props) {
		super(props);

		this.state = { term: '' };

		console.log(this.props);
	}

	render() {
		return (
			<div className="search-bar">
				<input
					value={this.state.term}
					onChange={(event) => this.onInputChange(event.target.value)}
					placeholder="Search YouTube:"
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
