import React from 'react';
import './style.css';
import './heegerreset.css';

class Splash extends React.Component {
	render() {
		return (
			<div
				style={{
					fontFamily: 'EB Garamond',
					backgroundColor: 'whitesmoke',
					border: '0',
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					flexFlow: 'row wrap'
				}}
			>
				<div
					style={{
						height: '100vh',
						display: 'flex',
						flexFlow: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%'
					}}
				>
					<h1
						style={{
							fontWeight: '400',
							fontSize: '5rem',
							margin: '-5rem 2rem 2rem 2rem',
							textAlign: 'center'
						}}
					>
						The Charity Block
					</h1>
				</div>
			</div>
		);
	}
}

export default Splash;
