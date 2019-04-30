import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ManageAccounts from '../../components/manage-accounts';

import { openModal } from '../../actions/modals-actions';
import { balanceSelector, historySelector } from '../wallet';
import { changePrimaryAccount, removeAllAccounts } from '../../actions/account-actions';
import { updateBalance } from '../../actions/balance-actions';

export default withRouter(connect(
	(state) => ({
		accounts: state.global.get('accounts'),
		balances: balanceSelector(state),
		histories: historySelector(state),
	}),
	(dispatch) => ({
		removeAllAccounts: () => dispatch(removeAllAccounts()),
		changePrimaryAccount: (indexAccount) => dispatch(changePrimaryAccount(indexAccount)),
		openModal: (modal, payload) => dispatch(openModal(modal, payload)),
		updateBalance: () => dispatch(updateBalance()),
	}),
)(ManageAccounts));
