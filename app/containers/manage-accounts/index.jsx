import { connect } from 'react-redux';
import ManageAccounts from '../../components/manage-accounts';

import { openModal } from '../../actions/modal-actions';

export default connect(
	() => ({}),
	(dispatch) => ({
		openModal: (modal) => dispatch(openModal(modal)),
	}),
)(ManageAccounts);
