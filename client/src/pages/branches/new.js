import React from 'react';
import { connect } from 'react-redux';
import { createBranch } from '../../store/actions';
import BranchForm from '../../components/BranchForm';

class NewBranch extends React.Component {
	onSubmit = (formValues) => {
		this.props.createBranch(formValues);
	};

	render() {
		return (
			<div>
				<h1>Plant Your Tree</h1>
				<BranchForm onSubmit={this.onSubmit} />
			</div>
		);
	}
}

export default connect(null, { createBranch })(NewBranch);
