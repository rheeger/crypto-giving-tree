import React from 'react';
import { connect } from 'react-redux';
import { editBranch } from '../../store/actions';
import BranchForm from '../../components/BranchForm';

class Manager extends React.Component {
	onSubmit = (formValues) => {
		this.props.editBranch(formValues);
	};

	render() {
		return (
			<div
				style={{
					margin: '0px auto',
					textAlign: 'left',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: 'auto',
					maxWidth: '700px'
				}}
			>
				<div>
					<h1>Plant Your Charity Tree:</h1>

					<BranchForm onSubmit={this.onSubmit} />
				</div>
			</div>
		);
	}
}

export default connect(null, { editBranch })(Manager);
