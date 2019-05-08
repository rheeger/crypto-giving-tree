import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';

class HomePage extends React.Component {
	render() {
		return (
			<div>
				<Grid className="Container">
					<Grid.Row>
						<Grid.Column width={16}>
							<div style={{ margin: '0 auto', textAlign: 'center' }}>
								<h2>Plant a Tree</h2>
								<p>Create a fund now, give grants at your leisure.</p>
								<Link to="/branches/new" className="ui button green">
									<i className="plus circle icon" />Get Plantin'
								</Link>
							</div>
						</Grid.Column>
					</Grid.Row>
					<br />
					<Grid.Row>
						<Grid.Column width={16}>
							<div style={{ margin: '0 auto', textAlign: 'center' }}>
								<h2>Search for Organizations</h2>
								<p>Find any 501c(3).</p>
								<Link to="/orgs">
									<Button
										style={{ marginTop: '2.5px', padding: '10px' }}
										content="Search"
										icon="sistrix medium icon"
										color="blue"
									/>
								</Link>
							</div>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}

export default HomePage;
