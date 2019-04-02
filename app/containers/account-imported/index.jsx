import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import avatar from '../../assets/images/default-avatar.svg';

class AccountImported extends React.Component {

	render() {

		return (
			<div className="main-bg">

				<div className="welcome-page">
					<div className="welcome-wrap">
						<div className="welcome-info import">
							<h1>
								New Echo account is
								<br />
								succesfully bound to Blip wallet
							</h1>

							<div className="account">
								<img className="avatar" src={avatar} alt="" />
								<div className="account-info">
									<div className="label">Account name</div>
									<div className="name">
										Homersimpson223090sdlc56-xf
									</div>
								</div>
							</div>
							<Button
								className="btn-primary arrow"
								content={(
									<React.Fragment>
										<div className="text">Proceed to Blip</div>
										<Icon className="arrow-right" />
									</React.Fragment>
								)}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

export default AccountImported;
