import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card, Grid, Table } from 'semantic-ui-react';
import { selectOrg, fetchOrg, fetchOrgLifetimeGrants, fetchOrgApprovedGrants } from '../../store/actions';
import OrgGrantRow from '../../components/tables/OrgGrantRow';

class OrgShow extends React.Component {
	componentDidMount() {
		const { fetchOrg, selectOrg, fetchOrgApprovedGrants, match, fetchOrgLifetimeGrants } = this.props;
		selectOrg(match.params.ein);
		fetchOrg(match.params.ein);
		fetchOrgApprovedGrants(match.params.ein);
		fetchOrgLifetimeGrants(match.params.ein);
	}

	renderRow() {
		if (Object.keys(this.props.gtGrants).length === 0) {
			return <Table.Row>No grants received, yet. Be the first today!</Table.Row>;
		}
		return Object.values(this.props.gtGrants).map((grant, index) => {
			return (
				<OrgGrantRow
					key={grant.id}
					id={grant.id}
					tree={grant.selectedTree}
					amount={grant.grantAmount}
					date={grant.grantDate}
					description={grant.grantDescription}
				/>
			);
		});
	}

	renderOrgDetails() {
		const { name, ruling_date, address, city, state, zipcode, updated_at } = this.props.org.organization;
		const { match, gtOrgs } = this.props;

		if (!gtOrgs[match.params.ein]) {
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
					description: 'Be the first to Donate!'
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

		const items = [
			{
				style: { overflowWrap: 'break-word' },
				header: name,
				description: 'last updated: ' + updated_at,
				extra: 'est: ' + ruling_date,
				fluid: true
			},
			{
				header: '$' + gtOrgs[match.params.ein].lifetimeGrants,
				// header: web3.utils.fromWei(minimumContribution, 'ether'),
				description: 'Raised to date'
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
		const { Header, Row, HeaderCell, Body } = Table;
		if (!this.props.org.organization || !this.props.gtGrants) {
			return <div> Loading... </div>;
		}
		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div style={{ maxWidth: '900px' }}>
					<Grid style={{ margin: '0 auto' }} className="Container">
						<Grid.Column width={11}>{this.renderOrgDetails()}</Grid.Column>
						<Grid.Column width={5}>
							<h3>Actions:</h3>
							<Link to={`/orgs/${this.props.match.params.ein}/claim`}>
								<Button basic color="yellow">
									Claim Org
								</Button>
							</Link>

							<Link to={`/orgs/${this.props.match.params.ein}/grants/new`}>
								<Button floated="left" basic color="red">
									<i className="paper plane icon" />send grant
								</Button>
							</Link>
						</Grid.Column>
						<Grid.Row>
							<Grid.Column width={16}>
								<h3>Completed Grants:</h3>
								<Table>
									<Header>
										<Row>
											<HeaderCell>Request Date</HeaderCell>
											<HeaderCell>Issuing Tree</HeaderCell>
											<HeaderCell>Description</HeaderCell>
											<HeaderCell>Amount</HeaderCell>
											<HeaderCell>Status</HeaderCell>
										</Row>
									</Header>
									<Body>{this.renderRow()}</Body>
								</Table>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		org: state.org,
		gtGrants: state.gtGrants,
		gtOrgs: state.gtOrgs
	};
};

export default connect(mapStateToProps, { selectOrg, fetchOrgApprovedGrants, fetchOrg, fetchOrgLifetimeGrants })(
	OrgShow
);
