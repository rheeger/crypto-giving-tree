import React from 'react';
import { connect } from 'react-redux';
import { plantTreeAndContract } from '../../store/actions';
import { Link } from 'react-router-dom';
import BranchForm from '../../components/BranchForm';

class Manager extends React.Component {
	onSubmit = (formValues) => {
		this.props.plantTreeAndContract(formValues);
	};

	renderList() {
		return Object.values(this.props.gtTrees).map(function(tree, index) {
			return (
				<div className="item" key={tree.id}>
					<div className="right floated content">
						<Link to={`/trees/edit/${tree.id}`} className="ui button">
							<i className="pencil alternate icon" />Edit
						</Link>
					</div>
					<i className="large middle aligned icon tree" />
					<div className="content">
						<Link to={`/trees/${tree.id}`}>{tree.branchName}</Link>
						<div className="description">{tree.id}</div>
					</div>
				</div>
			);
		});
	}

	render() {
		if (!this.props.gtTrees) {
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
						<h1>Plant a Charity Tree:</h1>

						<BranchForm onSubmit={this.onSubmit} />
					</div>
				</div>
			);
		}

		return (
			<div>
				<h2>My Charity Trees:</h2>
				<div className="ui celled list">{this.renderList()}</div>
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

export default connect(mapStateToProps, { plantTreeAndContract })(Manager);
