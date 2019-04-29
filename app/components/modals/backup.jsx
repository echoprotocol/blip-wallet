import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Animated } from 'react-animated-css';
import FocusTrap from 'focus-trap-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MODAL_BACKUP } from '../../constants/modal-constants';

class BackupModal extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			keys: [],
		};

		this.isMounted = false;
	}

	componentDidMount() {
		this.updateInfo();
	}

	componentDidUpdate() {
		this.updateInfo();
	}

	componentWillUnmount() {
		this.isMounted = true;
	}

	async updateInfo() {
		const { account } = this.props;

		if (!account) {
			return false;
		}

		const keys = await this.props.getKeysByAccountId(account);

		if (!this.isMounted) {
			this.setState({ keys });
		}

		return true;

	}

	render() {

		const { show } = this.props;

		if (show) {
			return (
				<Animated
					animationIn="fadeIn"
					animationOut="fadeOut"
					isVisible={show}
					className="modal-overlay"
				>
					<PerfectScrollbar className="modal-scroll">
						<FocusTrap>
							<div className="modal-wrap">
								<div className="modal-container">
									<div className="modal-header">
										<Button
											type="button"
											onClick={() => this.props.onClose(MODAL_BACKUP)}
											className="btn-modal-close"
											content={<Icon className="icon-close-big" />}
										/>

										<div className="modal-title">
											<span className="account-name">{this.props.account ? this.props.account.get('name') : null}</span>
											<FormattedMessage id="backup.info" />
										</div>
									</div>
									<div className="modal-body">
										<div className="backup-list">
											{this.state.keys.map((key) => (
												<div className="backup-item" key={key.publicKey}>
													<div className="key-wrap">
														<div className="key-label"><FormattedMessage id="backup.public_key" /></div>
														<div className="key">{key.publicKey}</div>
													</div>
													<div className="key-wrap">
														<div className="key-label"><FormattedMessage id="backup.wif" /></div>
														<div className="key-action">
															<div className="key">{key.wif}</div>
															<CopyToClipboard text={key.wif}>
																<Button
																	className="btn-square primary"
																	content={<Icon className="copy" />}
																/>
															</CopyToClipboard>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
									<div className="modal-footer">
										<div className="btns-wrap">
											<Button
												onClick={() => this.props.onClose(MODAL_BACKUP)}
												className="btn-modal"
												content={<FormattedMessage id="backup.close" />}
											/>
										</div>
									</div>
								</div>
							</div>
						</FocusTrap>
					</PerfectScrollbar>
				</Animated>
			);
		}

		return null;
	}

}

BackupModal.propTypes = {
	show: PropTypes.bool,
	account: PropTypes.object,
	onClose: PropTypes.func.isRequired,
	getKeysByAccountId: PropTypes.func,
};

BackupModal.defaultProps = {
	show: false,
	account: null,
	getKeysByAccountId: null,
};

export default BackupModal;
