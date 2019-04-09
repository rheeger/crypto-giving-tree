import React from 'react';
import ProPublica from '../apis/ProPublica';
import SearchBar from './SearchBar';

class App extends React.Component {
	state = { orgs: [] };

	onSearchSubmit = async (term) => {
		const response = await ProPublica.get('/search.json?c_code%5Bid%5D=3', {
			params: { q: term }
		});
		console.log(response);

		this.setState({ orgs: response.data });
	};

	render() {
		return (
			<div className="ui container" style={{ marginTop: '10px' }}>
				<SearchBar onSubmit={this.onSearchSubmit} />
				Found: {this.state.orgs.total_results} orgs
			</div>
		);
	}
}

export default App;
