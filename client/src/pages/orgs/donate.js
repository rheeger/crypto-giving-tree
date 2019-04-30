import React from 'react';
import { connect } from 'react-redux';
import ContributionForm from '../../components/ContributionForm';
import { selectOrg, fetchOrg, createOrg } from '../../store/actions';

class Donate extends React.Component {
	componentDidMount() {
		this.props.fetchOrg(this.props.match.params.ein);
		this.props.selectOrg(this.props.match.params.ein);
	}

	render() {
		if (!this.props.org.organization) {
			console.log(this.props);
			return <div>Loading Organization Details</div>;
		}

		// if (!this.props.GTorg.id === undefined) {
		// 	const id = this.props.match.params.ein;
		// 	console.log(this.props.GTorgs.id);
		// 	return <div>fuck you</div>;
		// }
		return (
			<div className="ui container">
				<div style={{ padding: '1rem', marginBottom: '1rem' }}>
					<h4>You're making a donation to:</h4>
					<h1>{this.props.org.organization.name}</h1>
				</div>
				<ContributionForm style={{ maxWdith: '400px' }} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		org: state.org,
		GTorgs: state.GTorgs,
		web3connect: state.web3connect
	};
};

export default connect(mapStateToProps, { selectOrg, fetchOrg, createOrg })(Donate);
