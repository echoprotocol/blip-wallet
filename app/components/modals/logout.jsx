import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Animated } from 'react-animated-css';
import FocusTrap from 'focus-trap-react';
import { MODAL_LOGOUT } from '../../constants/modal-constants';


class LogoutModal extends React.Component {

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
											onClick={() => this.props.onClose(MODAL_LOGOUT)}
											className="btn-modal-close"
											content={<Icon className="icon-close-big" />}
										/>

										<div className="modal-title">Logout</div>
									</div>
									<div className="modal-body">
										<div className="text">
                                            You are about to log out from the account
											<span to="/" className="info"> Account_name</span>.
                                            You will need this account WIF to log in again.
										</div>

									</div>
									<div className="modal-footer">
										<div className="btns-wrap">
											<Button
												className="btn-modal-primary"
												content="Confirm"
											/>
											<Button
												onClick={() => this.props.onClose(MODAL_LOGOUT)}
												className="btn-modal"
												content="Cancel"
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

LogoutModal.propTypes = {
	show: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
};

LogoutModal.defaultProps = {
	show: false,
};

export default LogoutModal;
