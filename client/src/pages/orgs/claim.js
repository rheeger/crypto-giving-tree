import React from 'react';
import { connect } from 'react-redux';
// import { Button } from 'semantic-ui-react';
import { selectOrg, createOrgClaim, fetchOrgs } from '../../store/actions';
import ClaimForm from '../../components/ClaimForm';
import Header from '../../components/Header';

class Claim extends React.Component {
	state = {
		loading: false
	};

	componentDidMount() {
		const { selectOrg, match, fetchOrgs } = this.props;
		selectOrg(match.params.ein);
		fetchOrgs();
		console.log(this.props.gtOrgs);
	}

	onSubmit = async (formValues) => {
		this.setState({ loading: true });
		console.log(this.props.gtOrgs);
		await this.props.createOrgClaim(
			formValues,
			this.props.web3.account,
			this.props.gtOrgs[this.props.match.params.ein].contractAddress,
			this.props.match.params.ein
		);
		this.setState({ loading: false });
	};

	render() {
		if (!this.props.org.organization) {
			return <div> Loading... </div>;
		}
		return (
			<div>
				<Header />

				<div
					style={{
						margin: '0px auto',
						textAlign: 'left',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: 'auto',
						width: '700px'
					}}
				>
					<div style={{ width: '500px' }}>
						<h1>Submit claim for: {this.props.org.organization.name}</h1>
						<p>Tax ID (EIN): {this.props.org.organization.ein}</p>
						<ClaimForm orgName={this.props.org.organization.name} onSubmit={this.onSubmit} />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		org: state.org,
		gtTrees: state.gtTrees,
		web3: state.web3connect,
		gtOrgs: state.gtOrgs
	};
};

export default connect(mapStateToProps, { selectOrg, createOrgClaim, fetchOrgs })(Claim);
