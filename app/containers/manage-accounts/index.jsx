import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ManageAccounts from '../../components/manage-accounts';

import { openModal } from '../../actions/modals-actions';
import { changePrimaryAccount } from '../../actions/account-actions';
import { updateBalance } from '../../actions/balance-actions';
import Services from '../../services';

const historySelector = Services.getSelector().getHistorySelector();
const balanceSelector = Services.getSelector().getWalletBalanceSelector();

export default withRouter(connect(
	(state) => ({
		accounts: state.global.get('accounts'),
		balances: balanceSelector(state),
		histories: historySelector(state),
	}),
	(dispatch) => ({
		changePrimaryAccount: (indexAccount) => dispatch(changePrimaryAccount(indexAccount)),
		openModal: (modal, data) => dispatch(openModal(modal, data)),
		updateBalance: () => dispatch(updateBalance()),
	}),
)(ManageAccounts));
