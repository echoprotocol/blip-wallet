import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import BackupModal from '../../components/modals/backup';
import { closeModal } from '../../actions/modal-actions';

import { MODAL_BACKUP } from '../../constants/modal-constants';

class Modal extends React.Component {

	onClose(modal) {
		this.props.closeModal(modal);
	}

	render() {
		const { showBackup } = this.props;
		return (
			<React.Fragment>
				<BackupModal
					show={showBackup}
					onClose={(modal) => this.onClose(modal)}
				/>
			</React.Fragment>
		);
	}

}

Modal.propTypes = {
	closeModal: PropTypes.func.isRequired,
	showBackup: PropTypes.bool,
};

Modal.defaultProps = {
	showBackup: false,
};

export default connect(
	(state) => ({
		showBackup: state.modal.getIn([MODAL_BACKUP, 'show']),
	}),
	(dispatch) => ({
		closeModal: (modal) => dispatch(closeModal(modal)),
	}),

)(Modal);
