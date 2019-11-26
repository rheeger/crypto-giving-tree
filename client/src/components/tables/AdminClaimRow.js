import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';
import { approveClaim, deleteClaim } from '../../store/actions';
import history from '../../history';
import Moment from 'react-moment';
import { fetchOrg } from '../../store/actions';

class AdminGrantRow extends Component {
	state = {
		approveloading: false,
		rejectloading: false,
		errorMessage: '',
		orgName: this.props.selectedOrg
	};

	componentDidMount() {
		this.renderTreeName();
	}

	onApprove = async () => {
		const { approveClaim, id, claimIndex, selectedOrg } = this.props;
		this.setState({ approveloading: true });
		await approveClaim(id, selectedOrg, claimIndex);
		this.setState({ approveloading: false });
		this.props.onSubmit();
		history.push('/admin');
	};

	onReject = async () => {
		const { deleteClaim, id } = this.props;
		this.setState({ rejectloading: true });
		await deleteClaim(id);
		this.setState({ rejectloading: false });
		history.push('/admin');
	};

	renderOrgName() {
		const { gtOrgs, selectedOrg } = this.props;
		return Object.values(gtOrgs).map((gtOrgs, key) => {
			if (selectedOrg === gtOrgs.id) {
				return this.setState({ orgName: gtOrgs.name });
			}
		});
	}

	render() {
		const { id, selectedOrg, recipient, amount, description, date, gtOrgs } = this.props;
		if (!gtOrgs[recipient]) {
			return <div>Loading...</div>;
		}

		return (
			<Table.Row>
				<Table.Cell>
					<Moment>{date}</Moment>
				</Table.Cell>
				<Table.Cell>
					<Link to={`/orgs/${selectedOrg}`}>{this.state.orgName}</Link>
				</Table.Cell>
				<Table.Cell>
					<Link to={`/orgs/${recipient}`}>
						{gtOrgs[recipient].name} (EIN: {recipient})
					</Link>
				</Table.Cell>
				<Table.Cell>{description}</Table.Cell>
				<Table.Cell>${amount} DAI</Table.Cell>
				<Table.Cell>
					<a href={`http://rinkeby.etherscan.io/tx/${id}`} target="blank">
						<Button color="blue" basic>
							View on Etherscan
						</Button>
					</a>
				</Table.Cell>
				<Table.Cell>
					<Button loading={this.state.approveloading} onClick={this.onApprove} color="green" basic>
						Approve
					</Button>
				</Table.Cell>
				<Table.Cell>
					<Button loading={this.state.rejectloading} onClick={this.onReject} color="red" basic>
						Reject
					</Button>
				</Table.Cell>
			</Table.Row>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		gtOrgs: state.gtOrgs
	};
};

export default connect(mapStateToProps, { approveClaim, deleteClaim, fetchOrg })(AdminGrantRow);
