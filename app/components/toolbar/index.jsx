import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import iosClose from '../../assets/images/toolbar/ios-close.svg';
import iosMinimize from '../../assets/images/toolbar/ios-minimize.svg';
import iosZoomOut from '../../assets/images/toolbar/ios-zoom-out.svg';
// import iosZoomIn from '../../assets/images/toolbar/ios-zoom-in.svg';

class Toolbar extends React.Component {

	render() {
		return (

			<div className="toolbar">
				<div className="ios-btns">
					<Button
						className="btn-ios-close"
						content={(
							<img src={iosClose} alt="ios-close" className="ios-close" />
						)}
					/>
					{/* ios-zoom can be disabled */}
					<Button
						className="btn-ios-minimize"
						content={(
							<img src={iosMinimize} alt="ios-minimize" className="ios-minimize" />
						)}
					/>
					<Button
						className="btn-ios-zoom"
						content={(
							<img src={iosZoomOut} alt="ios-zoom" />
						)}
					/>
					{/*
					<Button
						className="btn-ios-zoom"
						content={(
							<img src={iosZoomIn} alt="ios-zoom" />
						)}
					/>
					*/}
				</div>
				<div className="win-btns">

					<Button
						className="btn-win-minimize"
						content={(
							<Icon className="win-minimize" />
						)}
					/>
					<Button
						className="btn-win-zoom"
						content={(
							<Icon className="win-zoom-out" />
						)}
					/>
					{/*
					<Button
						className="btn-win-zoom"
						content={(
							<Icon className="win-zoom-in" />
						)}
					/>
					*/}
					<Button
						className="btn-win-close"
						content={(
							<Icon className="win-close" />
						)}
					/>
				</div>
			</div>
		);
	}

}


export default Toolbar;
