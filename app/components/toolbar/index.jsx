/* eslint-disable global-require */

import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import iosClose from '../../assets/images/toolbar/ios-close.svg';
import iosMinimize from '../../assets/images/toolbar/ios-minimize.svg';
import iosZoomOut from '../../assets/images/toolbar/ios-zoom-out.svg';
import iosZoomIn from '../../assets/images/toolbar/ios-zoom-in.svg';

class Toolbar extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			zoomed: false,
		};
	}

	onCloseApp() {
		if (process.platform) {
			require('electron').ipcRenderer.send('close-app');
		}
	}

	onZoomApp() {
		if (process.platform) {
			require('electron').ipcRenderer.send('zoom-app');
			this.setState((prevState) => ({ zoomed: !prevState.zoomed }));
		}
	}

	onMinimizeApp() {
		if (process.platform) {
			require('electron').ipcRenderer.send('minimize-app');
		}
	}

	renderWinButtons() {
		const { zoomed } = this.state;

		return (
			<div className="toolbar">
				<div className="win-btns">
					<Button
						className="btn-win-minimize"
						content={(
							<Icon className="win-minimize" />
						)}
						onClick={() => this.onMinimizeApp()}
					/>
					<Button
						className="btn-win-zoom"
						content={(
							<Icon className={zoomed ? 'win-zoom-in' : 'win-zoom-out'} />
						)}
						onClick={() => this.onZoomApp()}
					/>
					<Button
						className="btn-win-close"
						content={(
							<Icon className="win-close" />
						)}
						onClick={() => this.onCloseApp()}
					/>
				</div>
			</div>
		);
	}

	render() {
		const { zoomed } = this.state;

		if (process.platform === 'win32') {
			return this.renderWinButtons();
		}

		return (
			<div className="toolbar">
				<div className="ios-btns">
					<Button
						className="btn-ios-close"
						content={(
							<img src={iosClose} alt="ios-close" className="ios-close" />
						)}
						onClick={() => this.onCloseApp()}
					/>
					{/* ios-zoom can be disabled */}
					<Button
						className="btn-ios-minimize"
						content={(
							<img src={iosMinimize} alt="ios-minimize" className="ios-minimize" />
						)}
						onClick={() => this.onMinimizeApp()}
					/>
					<Button
						className="btn-ios-zoom"
						content={(
							<img src={zoomed ? iosZoomIn : iosZoomOut} alt="ios-zoom" />
						)}
						onClick={() => this.onZoomApp()}
					/>
				</div>
			</div>
		);
	}

}


export default Toolbar;
