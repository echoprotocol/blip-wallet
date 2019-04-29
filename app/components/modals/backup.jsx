import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Animated } from 'react-animated-css';
import FocusTrap from 'focus-trap-react';
import { MODAL_BACKUP } from '../../constants/modal-constants';


class BackupModal extends React.Component {

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
											<span className="account-name">Dmitrysizy0909</span>
											Backup info
										</div>
									</div>
									<div className="modal-body">
										<div className="backup-list">
											<div className="backup-item">
												<div className="key-wrap">
													<div className="key-label">Public key</div>
													<div className="key">ECHO5shQhzqWY11sVRtH5KCWiX4SpeFCvYuMKAm8sZA3cGRr4Q1EmV</div>
												</div>
												<div className="key-wrap">
													<div className="key-label">WIF</div>
													<div className="key-action">
														<div className="key">5JXNJabXtvnvhgM2sUt4ZGh6XEu3iRiqU96NQBX2jqdAFyuKyCJ</div>
														<Button
															className="btn-square primary"
															content={<Icon className="copy" />}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="modal-footer">
										<div className="btns-wrap">
											<Button
												onClick={() => this.props.onClose(MODAL_BACKUP)}
												className="btn-modal"
												content="Close"
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
	onClose: PropTypes.func.isRequired,
};

BackupModal.defaultProps = {
	show: false,
};

export default BackupModal;
