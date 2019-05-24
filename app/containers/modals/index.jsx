import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import BackupModal from './backup';
import LogoutModal from '../../components/modals/logout';
import { closeModal } from '../../actions/modals-actions';

import { MODAL_BACKUP, MODAL_LOGOUT } from '../../constants/modal-constants';
import { logoutAccount, removeAllAccounts } from '../../actions/account-actions';

class Modals extends React.Component {

	onClose(modal) {
		this.props.closeModal(modal);
	}

	render() {
		const { backupModal, logoutModal } = this.props;

		return (
			<React.Fragment>
				<BackupModal
					show={backupModal.get('show')}
					accountId={backupModal.get('accountId')}
					onClose={(modal) => this.onClose(modal)}
				/>
				<LogoutModal
					show={logoutModal.get('show')}
					all={logoutModal.get('all')}
					accountId={logoutModal.get('accountId')}
					accountName={logoutModal.get('accountName')}
					onClose={(modal) => this.onClose(modal)}
					logoutAccount={this.props.logoutAccount}
					removeAllAccounts={this.props.removeAllAccounts}
				/>
			</React.Fragment>
		);
	}

}

Modals.propTypes = {
	backupModal: PropTypes.object.isRequired,
	logoutModal: PropTypes.object.isRequired,
	closeModal: PropTypes.func.isRequired,
	logoutAccount: PropTypes.func.isRequired,
	removeAllAccounts: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		backupModal: state.modals.getIn([MODAL_BACKUP]),
		logoutModal: state.modals.getIn([MODAL_LOGOUT]),
	}),
	(dispatch) => ({
		closeModal: (modal) => dispatch(closeModal(modal)),
		logoutAccount: (id) => dispatch(logoutAccount(id)),
		removeAllAccounts: () => dispatch(removeAllAccounts()),
	}),
)(Modals);
