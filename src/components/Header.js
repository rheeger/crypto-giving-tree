import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
// import { Link } from '../routes';

export default () => {
	return (
		<Menu style={{ marginTop: '10px' }}>
			<div route="/">
				<a className="item">The Crypto Giving Tree</a>
			</div>

			<Menu.Menu position="right">
				<div route="/">
					<a>
						<Button
							style={{ marginTop: '2.5px', padding: '10px' }}
							content="Create a Branch"
							icon="add circle"
							color="green"
						/>
					</a>
				</div>
				<div route="/">
					<a>
						<Button style={{ marginTop: '2.5px', padding: '10px' }}>Find a 501c(3)</Button>
					</a>
				</div>

				<div route="/camdivaigns/new">
					<a className="item">+</a>
				</div>
			</Menu.Menu>
		</Menu>
	);
};
