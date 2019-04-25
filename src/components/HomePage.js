import React from 'react';
import _ from 'lodash';
import Link from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import Header from './Header';

class HomePage extends React.Component {
	render() {
		return (
			<Header>
				<Grid className="Container">
					<Grid.Row>
						<Grid.Column width={8}>
							<div style={{ margin: '0 auto', textAlign: 'center' }}>
								<h2>Grow the Tree</h2>
								<p>Create a fund now, give grants at your leisure.</p>
								<Link to="/branches">
									<a>
										<Button
											style={{ marginTop: '2.5px', padding: '10px' }}
											content="Create a Branch"
											icon="add circle"
											color="green"
										/>
									</a>
								</Link>
							</div>
						</Grid.Column>
						<Grid.Column width={8}>
							<div style={{ margin: '0 auto', textAlign: 'center' }}>
								<h2>Give Instantly</h2>
								<p>Find any 501c(3) and send them a donation.</p>
								<Link to="/orgs">
									<a>
										<Button
											style={{ marginTop: '2.5px', padding: '10px' }}
											content="Donate Direct"
											icon="dollar"
											color="blue"
										/>
									</a>
								</Link>
							</div>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Header>
		);
	}
}

export default HomePage;
