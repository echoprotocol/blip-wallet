import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import avatar from '../../assets/images/default-avatar.svg';

class accountCreated extends React.Component {

	render() {

		return (
			<div className="main-bg">
				<div className="welcome-page">
					<div className="welcome-wrap">
						<div className="welcome-info">
							<h1>
								{'New Echo account is '}
								<br />
								{'succesfully created'}
							</h1>
							<p>
								{'Account was added to Blip wallet automatically. '}
								{'You can get an access to it in other echo wallets.'}
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
						</div>
						<div className="welcome-card">
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
										{'Save your WIF key. '}
										<br />
										{'You will need it in case of restoring'}
										<br />
										{'or exporting this  account.'}
									</span>
									<div className="wif-wrap">
										<div className="wif-label">WIF</div>
										<div className="wif">
											{'5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF'}
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
						</div>
					</div>
					<div className="wif-toast">
						{'WIF is copied to clipboard'}
					</div>
				</div>
			</div>
		);
	}

}

export default accountCreated;
