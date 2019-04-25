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
		return (
			<div>
				<ContributionForm />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { org: state.org };
};

export default connect(mapStateToProps, { selectOrg })(Donate);
