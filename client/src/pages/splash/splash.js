import React from 'react';
// import './style.css';
import './heegerreset.css';
import logo from '../../assets/images/CBLogo.png';

class Splash extends React.Component {
	render() {
		return (
			<div>
				<div
					style={{
						fontFamily: 'EB Garamond'
					}}
				>
					<div
						style={{
							height: '100vh',
							display: 'flex',
							flexFlow: 'column',
							justifyContent: 'flex-start',
							alignItems: 'center',
							width: '100%'
						}}
					>
						<h3
							style={{
								fontWeight: '2rem',
								fontStyle: 'italic',
								fontSize: '1.25rem',
								padding: '2rem',
								margin: '2rem 2rem 0rem 2rem',
								textAlign: 'center'
							}}
						>
							future home of:
						</h3>
						<div style={{ margin: '0 auto' }}>
							<img style={{ maxHeight: '10rem' }} src={logo} alt="logo" />
						</div>
						<h3
							style={{
								fontSize: '1.5rem',
								margin: '2rem',
								textAlign: 'center'
							}}
						>
							...the best way to donate cryptocurrency.
						</h3>
					</div>
				</div>
			</div>
		);
	}
}

export default Splash;
