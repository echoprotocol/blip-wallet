import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import History from '../../components/history';
import {
	loadTransactions,
	loadMoreTransactions,
	toggleTransactionDetails,
	saveFilters,
	resetFilters,
} from '../../actions/transaction-actions';

export default injectIntl(connect(
	(state) => ({
		accounts: state.global.get('accounts'),
		language: state.global.get('language'),
		history: state.wallet.get('history'),
	}),
	(dispatch) => ({
		loadTransactions: () => dispatch(loadTransactions()),
		loadMoreTransactions: () => dispatch(loadMoreTransactions()),
		toggleTransactionDetails: (key) => dispatch(toggleTransactionDetails(key)),
		saveFilters: (accounts, coins, types) => dispatch(saveFilters(accounts, coins, types)),
		resetFilters: () => dispatch(resetFilters()),
	}),
)(History));
