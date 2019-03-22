import React from 'react';
import { Tab, Button } from 'semantic-ui-react';

import SignIn from './sign-in';
import SignUp from './sign-up';
import blipLogo from '../../assets/images/blip-logo.svg';
import googleLogo from '../../assets/images/google-logo.svg';


class Authorization extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			indexPanes: [0, -1],
			activeIndex: 0,
		};
	}

	setActiveTab(e, active) {
		e.stopPropagation();
		this.setState({
			activeIndex: active,
		});
	}

	generatePanes(e, panes) {

		const elmClasses = e.target.classList;

		if (!elmClasses.contains('menu-item') || elmClasses.contains('active')) {
			return;
		}

		panes.splice(-1, 1);

		const indexPanes = panes.map((pane) => (pane.menuItem.props.tabIndex === -1 ? 0 : -1)).reverse();

		this.setState({
			indexPanes,
		});
	}

	render() {

		const { activeIndex, indexPanes } = this.state;

		const panes = [
			{
				menuItem: <Button
					key="0"
					className="menu-item"
					content="Create new account"
					tabIndex={indexPanes[1]}
					onClick={(e) => this.setActiveTab(e, 0)}
				/>,
				render: () => (
					<Tab.Pane>
						<div className="inner"><SignIn /></div>
					</Tab.Pane>
				),
			},
			{
				menuItem: <Button
					key="1"
					className="menu-item"
					content="Import account"
					tabIndex={indexPanes[0]}
					onClick={(e) => this.setActiveTab(e, 1)}
				/>,
				render: () => (
					<Tab.Pane>
						<div className="inner"><SignUp /></div>
					</Tab.Pane>
				),
			},
			{
				menuItem: <Button
					key="2"
					className="g-auth"
					content={(
						<React.Fragment>
							<img className="ic" src={googleLogo} alt="" />
							<span className="text">Sign in with Google</span>
						</React.Fragment>
					)}
					onClick={(e) => this.setActiveTab(e, activeIndex)}
				/>,
			},
		];

		return (
			<div className="main-bg">
				<div className="logo-wrap">
					<img src={blipLogo} alt="" />
				</div>
				<Tab
					panes={panes}
					className="auth-tabs"
					activeIndex={activeIndex}
					onTabChange={(e, data) => this.generatePanes(e, data.panes)}
				/>
			</div>
		);
	}

}

export default Authorization;
