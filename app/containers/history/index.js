import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import History from '../../components/history';
import {
	loadTransactions,
	loadMoreTransactions,
	toggleTransactionDetails,
	saveFilters,
	resetFilters,
	setNewTransaction,
	clear,
} from '../../actions/transaction-actions';

export default injectIntl(connect(
	(state) => ({
		accounts: state.global.get('accounts'),
		language: state.global.get('language'),
		currentNode: state.global.get('currentNode'),
		transactions: state.wallet.getIn(['history', 'transactions']),
		filter: state.wallet.getIn(['history', 'filter']),
		total: state.wallet.getIn(['history', 'total']),
		localNodePercent: state.global.get('localNodePercent'),
	}),
	(dispatch) => ({
		loadTransactions: () => dispatch(loadTransactions()),
		loadMoreTransactions: () => dispatch(loadMoreTransactions()),
		toggleTransactionDetails: (key) => dispatch(toggleTransactionDetails(key)),
		saveFilters: (accounts, coins, types) => dispatch(saveFilters(accounts, coins, types)),
		resetFilters: () => dispatch(resetFilters()),
		setNewTransaction: (operation) => dispatch(setNewTransaction(operation)),
		clear: () => dispatch(clear('history')),
	}),
)(History));
