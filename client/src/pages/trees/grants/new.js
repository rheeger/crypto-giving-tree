import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Form, Button, Message } from 'semantic-ui-react';
import Tree from '../../../ethereum/tree';
import { Link } from 'react-router-dom';

class NewGrant extends Component {
	state = {
		value: '',
		description: '',
		recipient: '',
		errorMessage: '',
		loading: false
	};

	onSubmit = async (event) => {
		event.preventDefault();

		const tree = Tree(this.props.address);
		const { description, value, recipient } = this.state;

		this.setState({ loading: true, errorMessage: '' });

		try {
			const accounts = await this.props.web3.eth.getAccounts();

			await tree.methods.createRequest(description, this.props.web3.utils.toWei(value, 'ether'), recipient).send({
				from: accounts[0]
			});

			// Router.pushRoute(`/trees/${this.props.address}/requests`);
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};
	render() {
		return (
			<div>
				<h3>Create a New Grant</h3>
				<Form onSubmit={this.onSubmit}>
					<Form.Field>
						<label>Description</label>
						<Input
							value={this.state.description}
							onChange={(event) => this.setState({ description: event.target.value })}
						/>
					</Form.Field>
					<Form.Field>
						<label>Value</label>
						<Input
							label="ether"
							labelPosition="right"
							value={this.state.value}
							onChange={(event) => this.setState({ value: event.target.value })}
						/>
					</Form.Field>
					<Form.Field>
						<label>Recipient</label>
						<Input
							value={this.state.recipient}
							onChange={(event) => this.setState({ recipient: event.target.value })}
						/>
					</Form.Field>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<Button primary loading={this.state.loading}>
						Create!
					</Button>
					<Link route={`/trees/${this.props.address}/requests`}>
						<a>
							<Button secondary>View Requests</Button>
						</a>
					</Link>
				</Form>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		web3: state.web3connect
	};
};

export default connect(mapStateToProps)(NewGrant);
