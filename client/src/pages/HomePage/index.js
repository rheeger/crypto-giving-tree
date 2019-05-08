import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';

class HomePage extends React.Component {
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
									height: '75vh'
								}}
								width={16}
							>
								<div>
									<h1>Plant a Charity Tree today.</h1>
									<h3>
										Create your own chariable fund & award grants to qualifying non-profit
										organizations.
									</h3>
									<br />
									<Link to="/branches/new" className="ui button green">
										<i className="tree icon" />Get Started
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

export default HomePage;
