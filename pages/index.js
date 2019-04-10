import React from 'react';
import _ from 'lodash';
import ProPublica from '../src/apis/ProPublicaSearch';
import Layout from '../src/components/Layout';
import Header from '../src/components/Header';
import SearchBar from '../src/components/SearchBar';
import { timingSafeEqual } from 'crypto';
import ProPublicaSearch from '../src/apis/ProPublicaSearch';

class givingTreeIndex extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			orgs: [],
			selectedOrg: null
		};

		this.onSearchSubmit('A');
	}

	onSearchSubmit(term) {
		ProPublicaSearch({ term: term }, (orgs) => {
			this.setState({
				orgs: orgs,
				selectedOrg: orgs[0]
			});
		});
	}

	render() {
		return (
			<Layout>
				<Header>
					<SearchBar onSearchTermChange={(term) => this.onSearchSubmit(term)} />
				</Header>
			</Layout>
		);
	}
}

export default givingTreeIndex;
