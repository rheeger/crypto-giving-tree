import React from 'react';
import { Menu } from 'semantic-ui-react';
import SearchBar from './SearchBar';
// import { Link } from '../routes';

export default () => {
	return (
		<Menu style={{ marginTop: '10px' }}>
			<div route="/">
				<a className="item">The Crypto Giving Tree</a>
			</div>

			<Menu.Menu position="right">
				<div route="/">
					<a className="item">Branches</a>
				</div>
				<div route="/">
					<a className="item">Orgs</a>
				</div>

				<div route="/camdivaigns/new">
					<a className="item">+</a>
				</div>
			</Menu.Menu>
		</Menu>
	);
};
