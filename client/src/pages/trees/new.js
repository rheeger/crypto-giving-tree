import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { plantTreeAndContract } from '../../store/actions';
import BranchForm from '../../components/BranchForm';
import Header from '../../components/Header';

class NewTree extends React.Component {
	state = {
		ready: 'false',
		loading: false
	};

	componentDidMount() {
		this.setState({ ready: 'false' });
	}

	onSubmit = async (formValues) => {
		this.setState({ loading: true });
		await this.props.plantTreeAndContract(formValues);
		this.setState({ loading: false });
	};

	renderBranchForm = () => {
		this.setState({ ready: 'true' });
	};

	render() {
		if (this.state.ready === 'true') {
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
							<h1>Plant your Tree:</h1>

							<BranchForm onSubmit={this.onSubmit} loading={this.state.loading} />
						</div>
					</div>
				</div>
			);
		}

		return (
			<div>
				<Header />

				<div
					style={{
						margin: '0px auto',
						textAlign: 'left',
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
						height: '50vh',
						maxWidth: '350px'
					}}
				>
					<div>
						<h1>What is this? </h1>
						<p>some things to know...</p>
						<h3>
							1. Each Giving Tree is functionally equivalent to a{' '}
							<a href="https://en.wikipedia.org/wiki/Donor-advised_fund" target="blank">
								Donor Advised Fund.
							</a>
						</h3>
						<h3>
							2. You can easily contribute tokens to your Tree. The Charity Block supports{' '}
							<a href="https://beta.uniswap.info/" target="blank">
								all tokens with Uniswap Exchange Contracts.
							</a>
						</h3>
						<h3>
							3. Donated tokens are exchanged for{' '}
							<a href="https://makerdao.com/en/dai/" target="blank">
								DAI
							</a>. 1 DAI = 1 USD. Use the DAI to reccomend grants to any qualifyiing 501(c)(3) at your
							own pace.
						</h3>
						<br />

						<Button onClick={this.renderBranchForm} floated="left" className="ui button green">
							Got It!
						</Button>
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

export default connect(mapStateToProps, { plantTreeAndContract })(NewTree);
