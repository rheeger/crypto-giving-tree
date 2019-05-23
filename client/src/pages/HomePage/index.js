import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

class HomePage extends React.Component {
	renderManager() {
		if (!this.props.gtTrees.Object) {
			console.log(this.props.gtTrees);
			console.log(Object.keys(this.props.gtTrees).length);
			return 'Plant a Tree';
		}
		if (Object.keys(this.props.gtTrees).length > 0) {
			console.log(this.props.gtTrees.Object);
			return 'View My Trees';
		}
	}

	render() {
		return (
			<div>
				<div>
					<Grid className="Container">
						<Grid.Row>
							<Grid.Column
								style={{
									margin: '0px auto',
									textAlign: 'center',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '50vh'
								}}
								width={16}
							>
								<div>
									<h1>Plant a Charity Tree today.</h1>
									<h3>
										Create your own charitable fund. Extend grants to qualifying non-profit
										organizations.
									</h3>
									<br />
									<Link to="/trees/new" className="ui button green">
										<i className="plus circle icon" />
										{this.renderManager()}
									</Link>
								</div>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { gtTrees: state.gtTrees };
};

export default connect(mapStateToProps)(HomePage);
