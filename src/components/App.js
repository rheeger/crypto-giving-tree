import React from 'react';
import ProPublica from '../apis/ProPublica';
import SearchBar from './SearchBar';

class App extends React.Component {
	state = { orgs: [] };

	onSearchSubmit = async (term) => {
		const response = await ProPublica.get('/search.json?', {
			params: { q: term }
		});
		console.log(response);

		this.setState({ orgs: response.data.organizations });
	};

	render() {
		return (
			<div className="ui container" style={{ marginTop: '10px' }}>
				<SearchBar onSubmit={this.onSearchSubmit} />
				Found: {this.state.orgs.length} orgs
			</div>
		);
	}
}

export default App;
