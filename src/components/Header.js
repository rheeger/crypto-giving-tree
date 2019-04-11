import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { Link } from '../../routes';

export default () => {
	return (
		<Menu style={{ marginTop: '10px' }}>
			<Link route="/">
				<a className="item">The Crypto Giving Tree</a>
			</Link>

			<Menu.Menu position="right">
				<Link route="/branches">
					<a>
						<Button
							style={{ marginTop: '2.5px', padding: '10px' }}
							content="Create a Branch"
							icon="add circle"
							color="green"
						/>
					</a>
				</Link>
				<Link route="/orgs">
					<a>
						<Button style={{ marginTop: '2.5px', padding: '10px' }}>Find a 501c(3)</Button>
					</a>
				</Link>
			</Menu.Menu>
		</Menu>
	);
};
