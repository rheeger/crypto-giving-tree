import React from 'react';
import _ from 'lodash';
import { Button, Card, Icon } from 'semantic-ui-react';
import ProPublica from '../src/apis/ProPublica';
import Layout from '../src/components/Layout';
import Header from '../src/components/Header';
import SearchBar from '../src/components/SearchBar';
import { timingSafeEqual } from 'crypto';
import { Link } from '../routes';

class givingTreeIndex extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			orgs: [],
			selectedOrg: null
		};
		this.orgSearch(null);
	}

	orgSearch = async (term) => {
		const response = await ProPublica.get('/search.json?c_code%5Bid%5D=3', {
			params: { q: term }
		}).catch(function(error) {
			console.error(error);
		});

		console.log(response);

		this.setState({ orgs: response.data });
		console.log(this.state.orgs.organizations);
	};

	renderOrgs() {
		if (!this.state.orgs.organizations) {
			return <div> Loading... </div>;
		}

		const items = this.state.orgs.organizations.map((index, name) => {
			return {
				header: index.name,
				description: (
					<div>
						{index.city}, {index.state}
					</div>
				),
				meta: <Card.Meta>TAX-ID: {index.strein}</Card.Meta>,
				extra: (
					<Link route={`/orgs/${index.ein}`} className="ui two-buttons">
						<a>
							<Button floated="right" basic color="green">
								view details
							</Button>
						</a>
					</Link>
				)
			};
		});
		return <Card.Group items={items} />;
	}

	render() {
		const orgSearch = _.debounce((term) => {
			this.orgSearch(term);
		}, 300);

		return (
			<div>
				<Layout>
					<SearchBar onSearchTermChange={orgSearch} />
					<p>Found {this.state.orgs.total_results} organizations</p>
					{this.renderOrgs()}
				</Layout>
			</div>
		);
	}
}

export default givingTreeIndex;
