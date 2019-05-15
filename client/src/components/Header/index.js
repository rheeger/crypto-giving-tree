import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/givingTreeWide.svg';

export default () => {
	return (
		<Menu position="center" style={{ marginTop: '1rem' }}>
			<Link to="/" className="item">
				<img style={{ width: '15vh' }} alt="The Charity Tree" src={Logo} />
			</Link>

			<Menu.Menu position="right">
				<Link to="/trees/new" style={{ margin: '1rem auto', padding: '10px' }} className="ui button green">
					<i className="tree icon" />Get Started
				</Link>
				<Link to="/orgs" style={{ margin: '1rem', padding: '10px' }} className="ui button blue">
					<i className="sistrix medium icon" />Find Org
				</Link>
			</Menu.Menu>
		</Menu>
	);
};
