import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import classnames from 'classnames';
import blipLogo from '../../assets/images/blip-logo.svg';

class UnlockWallet extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showPas: false,
		};
	}

	onTogglePrivacy() {
		const { showPas } = this.state;
		this.setState({ showPas: !showPas });
	}

	renderPrivacyEye() {
		const { showPas } = this.state;
		return (
			<Button
				tabIndex="-1"
				className={
					classnames(
						'icon-eye',
						{ enable: showPas },
						{ disabled: !showPas },
					)
				}
				onClick={() => this.onTogglePrivacy()}
			/>
		);
	}

	render() {
		const { showPas } = this.state;

		return (
			<div className="main-bg">

				<div className="unlock-page">
					<img className="blip-logo" src={blipLogo} alt="" />
					<div className="unlock-info">
						Unlock your wallet
					</div>
					<div className="form-wrap">
						<div className="line">
							<div className="line-content">
								<div className="field">
									<Input
										placeholder="Enter Password"
										ref={(input) => { this.nameInput = input; }}
										className="password"
										error
										loading={false}
										type={showPas ? 'text' : 'password'}
										icon={this.renderPrivacyEye()}
										fluid
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="btn-wrap">
						{/* Toggle class ok,  */}
						<Button
							className="btn-primary round-animation ok"
							fluid
							content={(
								<React.Fragment>
									<div className="text">Unlock</div> // Clear if disabled
								</React.Fragment>
							)}
						/>
					</div>
					<div className="link-wrap">
						<a className="link" href="/restore-password">Forgot password?</a>
					</div>

				</div>
			</div>
		);
	}

}

export default UnlockWallet;
