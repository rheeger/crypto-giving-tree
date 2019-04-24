import React from 'react';
import Header from './Header';
import Head from 'next/head';
import { Container } from 'semantic-ui-react';

export default (props) => {
	return (
		<Container>
			<Head>
				<link rel="stylesheet" href="/static/css/SearchBar.css" />
				<link rel="stylesheet" href="/static/css/variables.scss" />
				<link rel="stylesheet" href="/static/css/send.scss" />
				<link rel="stylesheet" href="/static/css/oversized-panel.scss" />
				<link rel="stylesheet" href="/static/css/qr-code.scss" />
				<link rel="stylesheet" href="/static/css/modal.scss" />
				<link rel="stylesheet" href="/static/css/currency-panel.scss" />
				<link rel="stylesheet" href="/static/css/contextual-info.scss" />
				<link rel="stylesheet" href="/static/css/address-input-panel.scss" />
				<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
			</Head>
			<Header />
			{props.children}
		</Container>
	);
};
