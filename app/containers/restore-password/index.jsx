import React from 'react';
import { Button } from 'semantic-ui-react';
import blipLogo from '../../assets/images/blip-logo.svg';

class RestorePassword extends React.Component {

	render() {
		return (
			<div className="main-bg">

				<div className="restore-page">
					<div className="restore-wrap">
						<img className="blip-logo" src={blipLogo} alt="" />
						<div className="restore-info">
							<h1>
								Your Password number cannot be restored
							</h1>
							<p>
								You can clear your account data from Blip and set a new password.
								If you do, you will lose access to the accounts you&apos;ve logged into.
								You will need to log into them again, after you have set a&nbsp;new&nbsp;password.
							</p>

						</div>
						<div className="clear-container">
							<div className="checkbox">
								<input type="checkbox" id="clear-data" />
								<label htmlFor="clear-data" className="checkbox-label">
									<div className="label-text">
										I understand that Blip does not store backups of my account keys,
										and I will lose access to them by clearing my account data.
									</div>
								</label>
							</div>
							<Button
								className="btn-white"
								disabled
								fluid
								content={(
									<React.Fragment>
										<div className="text">Clear Blip Data</div>
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

export default RestorePassword;
