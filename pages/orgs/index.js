import React from 'react';
import _ from 'lodash';
import { Button, Card } from 'semantic-ui-react';
import Layout from '../../src/components/Layout';
import SearchBar from '../../src/components/SearchBar';
import { Link } from '../../routes';
import { connect } from 'react-redux';
import { searchOrgs } from '../../src/store/actions/index';

class orgIndex extends React.Component {
	componentDidMount() {
		this.props.searchOrgs(null);
	}

	renderOrgs() {
		if (!this.props.orgs.organizations) {
			return <div> Loading... </div>;
		}

		const items = this.props.orgs.organizations.map((index, name) => {
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
			this.props.searchOrgs(term);
		}, 300);

		return (
			<Layout>
				<SearchBar onSearchTermChange={orgSearch} />
				<p>Found {this.props.orgs.total_results} organizations</p>
				{this.renderOrgs()}
			</Layout>
		);
	}
}

const mapStateToProps = (state) => {
	return { orgs: state.orgs };
};

export default connect(mapStateToProps, { searchOrgs })(orgIndex);
