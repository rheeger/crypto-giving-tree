import React from 'react';
import { connect } from 'react-redux';
// import ContributionForm from '../../src/components/ContributionForm';
// import { Web3Connect, startWatching, initialize } from '../../store/reducers/web3connect';
// import { setAddresses } from '../../store/reducers/swapAddresses';
import ContributionForm from '../ContributionForm';
import { selectOrg } from '../../store/actions';

class Donate extends React.Component {
	componentDidMount() {
		this.props.selectOrg(this.props.match.params.ein);
	}

	render() {
		if (!this.props.org.organization) {
			return <div>Loading Organization Details</div>;
		}
		return (
			<div className="ui container">
				<div style={{ padding: '1rem', marginBottom: '1rem' }}>
					<h4>You're making a donation to:</h4>
					<h1>{this.props.org.organization.name}</h1>
				</div>
				<ContributionForm style={{ maxWdith: '700px' }} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { org: state.org };
};

export default connect(mapStateToProps, { selectOrg })(Donate);
