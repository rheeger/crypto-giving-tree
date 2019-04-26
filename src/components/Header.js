import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default () => {
	return (
		<Menu style={{ marginTop: '10px' }}>
			<Link to="/" className="item">
				The Crypto Giving Tree
			</Link>

			<Menu.Menu position="right">
				<Link to="/branches" style={{ margin: '2.5px', padding: '10px' }} className="ui button green">
					<i className="plus circle icon" />Branch
				</Link>
				<Link to="/orgs" style={{ margin: '2.5px', padding: '10px' }} className="ui button blue">
					<i className="sistrix medium icon" />Find
				</Link>
			</Menu.Menu>
		</Menu>
	);
};
