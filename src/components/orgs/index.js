import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Button, Card } from 'semantic-ui-react';

import SearchBar from '../SearchBar';
import { connect } from 'react-redux';
import { searchOrgs } from '../../store/actions/index';

class OrgIndex extends React.Component {
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
					<div>
						<Link to={`/orgs/${index.ein}`} className="ui two-buttons">
							<Button floated="right" basic color="green">
								view details
							</Button>
						</Link>
						<Link to={`/orgs/${index.ein}/donate`} className="ui two-buttons">
							<Button floated="left" basic color="red">
								donate
							</Button>
						</Link>
					</div>
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
			<div>
				<SearchBar onSearchTermChange={orgSearch} />
				<p>Found {this.props.orgs.total_results} organizations</p>
				{this.renderOrgs()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { orgs: state.orgs };
};

export default connect(mapStateToProps, { searchOrgs })(OrgIndex);
