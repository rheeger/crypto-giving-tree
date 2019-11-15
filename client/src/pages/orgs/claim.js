import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { plantTreeAndContract } from '../../store/actions';
import ClaimForm from '../../components/ClaimForm';
import Header from '../../components/Header';

class Claim extends React.Component {
	state = {
		ready: 'false',
		loading: false,
		orgName: 'hello this is a test form'
	};

	componentDidMount() {
		this.setState({ ready: 'false' });
	}

	onSubmit = async (formValues) => {
		this.setState({ loading: true });

		this.setState({ loading: false });
	};

	renderClaimForm = () => {
		this.setState({ ready: 'true' });
	};

	render() {
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
						<h1>Claim:</h1>

						<ClaimForm orgName={this.state.orgName} onSubmit={this.onSubmit} loading={this.state.loading} />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		gtTrees: state.gtTrees,
		web3: state.web3connect
	};
};

export default connect(mapStateToProps, { plantTreeAndContract })(Claim);
