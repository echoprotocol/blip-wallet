/* eslint-disable global-require */

import React from 'react';
import ReactDOM from 'react-dom';
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
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		this.refToolbar = React.createRef();
		this.refMinimize = React.createRef();
		this.refZom = React.createRef();
		this.refClose = React.createRef();

		document.addEventListener('click', this.handleClick, true);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClick);
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

	handleClick(e) {
		/* eslint-disable */
		const toolbar = ReactDOM.findDOMNode(this.refToolbar.current);
		const zom = ReactDOM.findDOMNode(this.refZom.current);
		const close = ReactDOM.findDOMNode(this.refClose.current);
		/* eslint-enable */

		if (toolbar.contains(e.target)) {
			e.stopImmediatePropagation();
			if (close.contains(e.target)) {
				this.onCloseApp();
				return;
			}
			if (zom.contains(e.target)) {
				this.onZoomApp();
				return;
			}
			this.onMinimizeApp();
		}
	}

	renderWinButtons() {
		const { zoomed } = this.state;

		return (
			<div className="toolbar" ref={this.refToolbar}>
				<div className="draggable" />
				<div className="win-btns">
					<Button
						ref={this.refMinimize}
						className="btn-win-minimize"
						content={(
							<Icon className="win-minimize" />
						)}
						onClick={() => this.onMinimizeApp()}
					/>
					<Button
						ref={this.refZom}
						className="btn-win-zoom"
						content={(
							<Icon className={zoomed ? 'win-zoom-in' : 'win-zoom-out'} />
						)}
						onClick={() => this.onZoomApp()}
					/>
					<Button
						ref={this.refClose}
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
			<div className="toolbar" ref={this.refToolbar}>
				<div className="draggable before-ios-btns" />
				<div className="ios-btns">
					<Button
						ref={this.refClose}
						className="btn-ios-close"
						content={(
							<img src={iosClose} alt="ios-close" className="ios-close" />
						)}
						onClick={() => this.onCloseApp()}
					/>
					<Button
						ref={this.refMinimize}
						className="btn-ios-minimize"
						content={(
							<img src={iosMinimize} alt="ios-minimize" className="ios-minimize" />
						)}
						onClick={() => this.onMinimizeApp()}
						disabled={zoomed}
					/>
					<Button
						ref={this.refZom}
						className="btn-ios-zoom"
						content={(
							<img src={zoomed ? iosZoomIn : iosZoomOut} alt="ios-zoom" />
						)}
						onClick={() => this.onZoomApp()}
					/>
				</div>
				<div className="draggable" />
			</div>
		);
	}

}


export default Toolbar;
