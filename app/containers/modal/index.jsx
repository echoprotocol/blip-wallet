import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import BackupModal from '../../components/modals/backup';
import LogoutModal from '../../components/modals/logout';
import { closeModal } from '../../actions/modal-actions';

import { MODAL_BACKUP, MODAL_LOGOUT } from '../../constants/modal-constants';

class Modal extends React.Component {

	onClose(modal) {
		this.props.closeModal(modal);
	}

	render() {
		const { showBackup, showLogout } = this.props;
		return (
			<React.Fragment>
				<BackupModal
					show={showBackup}
					onClose={(modal) => this.onClose(modal)}
				/>
				<LogoutModal
					show={showLogout}
					onClose={(modal) => this.onClose(modal)}
				/>
			</React.Fragment>
		);
	}

}

Modal.propTypes = {
	closeModal: PropTypes.func.isRequired,
	showBackup: PropTypes.bool,
	showLogout: PropTypes.bool,
};

Modal.defaultProps = {
	showBackup: false,
	showLogout: false,
};

export default connect(
	(state) => ({
		showBackup: state.modal.getIn([MODAL_BACKUP, 'show']),
		showLogout: state.modal.getIn([MODAL_LOGOUT, 'show']),
	}),
	(dispatch) => ({
		closeModal: (modal) => dispatch(closeModal(modal)),
	}),

)(Modal);
