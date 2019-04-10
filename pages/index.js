import React from 'react';
import _ from 'lodash';
import ProPublica from '../src/apis/ProPublica';
import Layout from '../src/components/Layout';
import Header from '../src/components/Header';
import SearchBar from '../src/components/SearchBar';
import { timingSafeEqual } from 'crypto';

class givingTreeIndex extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			orgs: [],
			selectedOrg: null
		};

		this.orgSearch('A');
		console.log(this.state.orgs.length);
	}

	orgSearch = async (term) => {
		const response = await ProPublica.get('/search.json?c_code%5Bid%5D=3', {
			params: { q: term }
		});
		console.log(response);

		this.setState({ orgs: response.data });
	};

	render() {
		const orgSearch = _.debounce((term) => {
			this.orgSearch(term);
		}, 300);

		return (
			<div>
				<Layout>
					<SearchBar onSearchTermChange={orgSearch} />
					<p>Found {this.state.orgs.total_results}</p>
				</Layout>
			</div>
		);
	}
}

export default givingTreeIndex;
