import React from 'react';
// import './style.css';
import './heegerreset.css';

class Splash extends React.Component {
	render() {
		return (
			<div>
				<div
					style={{
						fontFamily: 'EB Garamond',
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
						<h3
							style={{
								fontWeight: '2rem',
								fontStyle: 'italic',
								fontSize: '2rem',
								padding: '2rem',
								margin: '-20rem 2rem 2rem 2rem',
								textAlign: 'center'
							}}
						>
							future home of:
						</h3>
						<h1
							style={{
								fontWeight: '400',
								margin: '-3rem 2rem 2rem 2rem',
								fontSize: '5rem',
								padding: '2rem',
								textAlign: 'center'
							}}
						>
							The Charity Block
						</h1>
						<h3
							style={{
								fontSize: '1.75rem',
								padding: '2rem',
								margin: '-3rem 2rem 2rem 2rem',
								textAlign: 'center'
							}}
						>
							Donate crypto to any non-profit organization.
						</h3>
					</div>
				</div>
			</div>
		);
	}
}

export default Splash;
