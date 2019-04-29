import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import BackupModal from './backup';
import LogoutModal from '../../components/modals/logout';
import { closeModal } from '../../actions/modals-actions';

import { MODAL_BACKUP, MODAL_LOGOUT } from '../../constants/modal-constants';

class Modals extends React.Component {

	onClose(modal) {
		this.props.closeModal(modal);
	}

	render() {

		const { backup, showLogout } = this.props;

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
				/>
			</React.Fragment>
		);
	}

}

Modals.propTypes = {
	closeModal: PropTypes.func.isRequired,
	backup: PropTypes.object,
	showLogout: PropTypes.bool,
};

Modals.defaultProps = {
	backup: null,
	showLogout: false,
};

export default connect(
	(state) => ({
		backup: state.modals.getIn([MODAL_BACKUP]),
		showLogout: state.modals.getIn([MODAL_LOGOUT, 'show']),
	}),
	(dispatch) => ({
		closeModal: (modal) => dispatch(closeModal(modal)),
	}),
)(Modals);
