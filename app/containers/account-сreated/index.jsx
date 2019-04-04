import React from 'react';
import { Animated } from 'react-animated-css';
import { Button, Icon } from 'semantic-ui-react';
import avatar from '../../assets/images/default-avatar.svg';

class AccountCreated extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isVisible: true,
		};
	}

	render() {
		const { isVisible } = this.state;
		return (
			<div className="welcome-page page">
				<div
					className="welcome-wrap"

				>

					<Animated
						className="welcome-info"
						animationIn="fadeInRight"
						animationOut="fadeOutLeft"
						isVisible={isVisible}
					>
						<h1>
							New Echo account is
							<br />
							succesfully created
						</h1>
						<p>
							Account was added to Blip wallet automatically.
							You can get an access to it in other echo wallets.
						</p>
						<Button
							className="btn-primary arrow"
							content={(
								<React.Fragment>
									<div className="text">Proceed to Blip</div>
									<Icon className="arrow-right" />
								</React.Fragment>
							)}
						/>
					</Animated>
					<Animated
						className="welcome-card"
						animationIn="fadeInRight"
						animationOut="fadeOutLeft"
						animationInDelay={50}
						isVisible={isVisible}
					>
						<div className="head">
							<div className="card-wrap">
								<img className="avatar" src={avatar} alt="" />
								<div className="account-info">
									<div className="label">Account name</div>
									<div className="name">Homersimpson223090sdlc56-xf</div>
								</div>
							</div>
						</div>
						<div className="body">
							<div className="card-wrap">
								<span>
									Save your WIF key.
									<br />
									You will need it in case of restoring
									<br />
									or exporting this  account.
								</span>
								<div className="wif-wrap">
									<div className="wif-label">WIF</div>
									<div className="wif">
										5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF
									</div>
								</div>
								<Button
									className="btn-white"
									content={(
										<React.Fragment>
											<Icon name="copy" />
											<div className="text">Copy WIF to clipboard</div>
										</React.Fragment>
									)}
								/>
							</div>
						</div>
					</Animated>
				</div>
				<Animated
					className="wif-toast"
					animationIn="fadeIn"
					animationOut="fadeOut"
					isVisible={isVisible}
				> WIF is copied to clipboard
				</Animated>

			</div>
		);
	}

}

export default AccountCreated;
