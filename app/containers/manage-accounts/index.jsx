import { connect } from 'react-redux';
import ManageAccounts from '../../components/manage-accounts';

import { openModal } from '../../actions/modals-actions';
import { balanceSelector } from '../wallet';
import { changePrimaryAccount, removeAllAccounts } from '../../actions/account-actions';

export default connect(
	(state) => ({
		accounts: state.global.get('accounts'),
		balances: balanceSelector(state),
	}),
	(dispatch) => ({
		removeAllAccounts: () => dispatch(removeAllAccounts()),
		changePrimaryAccount: (indexAccount) => dispatch(changePrimaryAccount(indexAccount)),
		openModal: (modal, payload) => dispatch(openModal(modal, payload)),
	}),
)(ManageAccounts);
