import React from 'react';
import _ from 'lodash';
import { Button, Card, Icon, Grid } from 'semantic-ui-react';
import ProPublica from '../../src/apis/ProPublica';
import Layout from '../../src/components/Layout';
import Header from '../../src/components/Header';
import SearchBar from '../../src/components/SearchBar';
import { timingSafeEqual } from 'crypto';
import { Link, Router } from '../../routes';
import { isFulfilled } from 'q';
import { selectOrg } from '../../src/store/actions';
import { connect } from 'react-redux';

class orgShow extends React.Component {
	static async getInitialProps(props) {
		const ein = props.query.ein;
		console.log(props.query);
		return {
			ein
		};
	}

	componentDidMount() {
		this.props.selectOrg(this.props.ein);
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
		const orgSearch = _.debounce((term) => {
			this.selectOrg(term);
		}, 300);

		return (
			<div>
				<Layout>
					<Grid style={{ margin: '0 auto' }} className="Container">
						<Grid.Column width={11}>{this.renderOrgDetails()}</Grid.Column>
						<Grid.Column width={5}>
							<h3>Actions:</h3>
							<Link route={`/orgs/${this.props.ein}/claim`}>
								<a>
									<Button color="yellow">Claim This Org</Button>
								</a>
							</Link>
							<br />
							<Link route={`/orgs/${this.props.ein}/donate`}>
								<a>
									<Button style={{ margin: '10px auto' }} color="green">
										Donate Now!
									</Button>
								</a>
							</Link>
						</Grid.Column>
					</Grid>
				</Layout>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { org: state.org };
};

export default connect(mapStateToProps, { selectOrg })(orgShow);
