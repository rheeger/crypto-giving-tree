import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default () => {
	return (
		<Menu style={{ marginTop: '1rem' }}>
			<Link
				to="/alpha"
				className="item"
				style={{
					fontFamily: 'EB Garamond',
					fontSize: '1.5rem'
				}}
			>
				The Charity Block
			</Link>

			<Menu.Menu position="right">
				<Link to="/trees" style={{ margin: '1rem auto', padding: '10px' }} className="ui button green">
					<i className="tree icon" />My Trees
				</Link>
				<Link to="/orgs" style={{ margin: '1rem', padding: '10px' }} className="ui button blue">
					<i className="sistrix medium icon" />Organizations
				</Link>
			</Menu.Menu>
		</Menu>
	);
};
