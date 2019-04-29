import { connect } from 'react-redux';
import ManageAccounts from '../../components/manage-accounts';

import { openModal } from '../../actions/modal-actions';
import { MODAL_BACKUP } from '../../constants/modal-constants';

export default connect(
	() => ({}),
	(dispatch) => ({
		openModal: () => dispatch(openModal(MODAL_BACKUP)),
	}),
)(ManageAccounts);
