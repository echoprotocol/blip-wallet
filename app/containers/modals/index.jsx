import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import BackupModal from './backup';
import LogoutModal from '../../components/modals/logout';
import { closeModal } from '../../actions/modals-actions';

import { MODAL_BACKUP, MODAL_LOGOUT } from '../../constants/modal-constants';
import { logoutAccount } from '../../actions/account-actions';

class Modals extends React.Component {

	onClose(modal) {
		this.props.closeModal(modal);
	}

	render() {
		const {
			showLogout, logout, backup, logoutForm,
		} = this.props;

		return (
			<React.Fragment>
				{backup && backup.get('show')
					? (
						<BackupModal
							accountId={backup.get('accountId')}
							show={backup.get('show')}
							onClose={(modal) => this.onClose(modal)}
						/>
					)
					: null }
				<LogoutModal
					show={showLogout}
					onClose={(modal) => this.onClose(modal)}
					logout={logout}
					accountId={logoutForm.get('accountId')}
					accountName={logoutForm.get('accountName')}
				/>
			</React.Fragment>
		);
	}

}

Modals.propTypes = {
	closeModal: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
	backup: PropTypes.object,
	logoutForm: PropTypes.object,
	showLogout: PropTypes.bool,
};

Modals.defaultProps = {
	backup: null,
	logoutForm: null,
	showLogout: false,
};

export default connect(
	(state) => ({
		backup: state.modals.getIn([MODAL_BACKUP]),
		logoutForm: state.modals.getIn([MODAL_LOGOUT]),
		showLogout: state.modals.getIn([MODAL_LOGOUT, 'show']),
	}),
	(dispatch) => ({
		closeModal: (modal) => dispatch(closeModal(modal)),
		logout: (id) => dispatch(logoutAccount(id)),
	}),
)(Modals);
