import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Animated } from 'react-animated-css';
import FocusTrap from 'focus-trap-react';
import { MODAL_LOGOUT } from '../../constants/modal-constants';


class LogoutModal extends React.Component {

	logout() {
		const { all, accountId } = this.props;

		this.props.onClose(MODAL_LOGOUT);

		if (all) {
			this.props.removeAllAccounts();
		} else {
			this.props.logoutAccount(accountId);
		}
	}

	renderBody() {
		const { all, accountName } = this.props;

		if (all) {
			return (
				<div className="modal-body">
					<div className="text">
						You are about to log out from all the accounts attached to Blip.
						You will need to import existing accounts using WIF to see them in the list of Blip accounts or create a new one after completing this action.
						Do you want to proceed?
					</div>
				</div>
			);
		}

		return (
			<div className="modal-body">
				<div className="text">
					You are about to log out from the account
					<span to="/" className="info"> {accountName}</span>.
						You will need this account WIF to log in again.
				</div>
			</div>
		);
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
											onClick={() => this.props.onClose(MODAL_LOGOUT)}
											className="btn-modal-close"
											content={<Icon className="icon-close-big" />}
										/>

										<div className="modal-title">Logout</div>
									</div>
									{this.renderBody()}
									<div className="modal-footer">
										<div className="btns-wrap">
											<Button
												className="btn-modal-primary"
												content="Confirm"
												onClick={() => this.logout()}
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
	all: PropTypes.bool,
	accountId: PropTypes.string,
	accountName: PropTypes.string,
	onClose: PropTypes.func.isRequired,
	logoutAccount: PropTypes.func.isRequired,
	removeAllAccounts: PropTypes.func.isRequired,
};

LogoutModal.defaultProps = {
	show: false,
	all: false,
	accountId: '',
	accountName: '',
};

export default LogoutModal;
