import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import BranchForm from '../../components/BranchForm';

class Manager extends React.Component {
	renderList() {
		return Object.values(this.props.gtTrees).map(function(tree, index) {
			return (
				<div className="item" key={tree.id}>
					<div className="right floated content">Balance: ${tree.treeDAI}</div>
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
			return <div>Loading...</div>;
		}

		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div style={{ width: '800px' }}>
					<h2>My Charity Trees:</h2>
					<div className="ui celled list">{this.renderList()}</div>
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

export default connect(mapStateToProps)(Manager);
