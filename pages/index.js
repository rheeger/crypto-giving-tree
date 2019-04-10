import React from 'react';
import ProPublica from '../src/apis/ProPublica';
import Layout from '../src/components/Layout';
import Header from '../src/components/Header';
import SearchBar from '../src/components/SearchBar';

class givingTreeIndex extends React.Component {
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
			<Layout>
				<Header>
					<SearchBar onSubmit={this.onSearchSubmit} />
					Found: {this.state.orgs.total_results} orgs
				</Header>
			</Layout>
		);
	}
}

export default givingTreeIndex;
