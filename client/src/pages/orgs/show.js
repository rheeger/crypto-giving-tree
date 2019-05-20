import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card, Grid } from 'semantic-ui-react';
import { selectOrg } from '../../store/actions';

class OrgShow extends React.Component {
	componentDidMount() {
		this.props.selectOrg(this.props.match.params.ein);
	}

	renderOrgDetails() {
		if (!this.props.org.organization) {
			return <div> Loading... </div>;
		}

		const { name, ruling_date, address, city, state, zipcode, updated_at } = this.props.org.organization;

		const items = [
			{
				style: { overflowWrap: 'break-word' },
				header: name,
				description: 'last updated: ' + updated_at,
				extra: 'est: ' + ruling_date,
				fluid: true
			},
			{
				header: '$0 Donated',
				// header: web3.utils.fromWei(minimumContribution, 'ether'),
				description: 'Make a donation today!',
				extra: 'Raised to date'
			},
			{
				header: address,
				// header: web3.utils.fromWei(balance, 'ether'),
				extra: zipcode,
				description: city + ', ' + state
			}
		];

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<div>
				<Grid style={{ margin: '0 auto' }} className="Container">
					<Grid.Column width={11}>{this.renderOrgDetails()}</Grid.Column>
					<Grid.Column width={5}>
						<h3>Actions:</h3>
						<Link to={`/orgs/${this.props.match.params.ein}/claim`}>
							<Button basic color="yellow">
								Claim This Org
							</Button>
						</Link>

						<Link to={`/orgs/${this.props.match.params.ein}/grant/new`}>
							<Button floated="left" basic color="red">
								<i class="paper plane icon" />send grant
							</Button>
						</Link>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { org: state.org };
};

export default connect(mapStateToProps, { selectOrg })(OrgShow);
