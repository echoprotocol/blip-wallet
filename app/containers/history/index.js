import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import History from '../../components/history';
import { getFilteredHistory, toggleTransactionDetails, updateFilter } from '../../actions/transaction-actions';

export default injectIntl(connect(
	(state) => ({
		accounts: state.global.get('accounts'),
		language: state.global.get('language'),
		history: state.wallet.get('history'),
	}),
	(dispatch) => ({
		getFilteredHistory: () => dispatch(getFilteredHistory()),
		toggleTransactionDetails: (key) => dispatch(toggleTransactionDetails(key)),
		updateFilter: (filter, key) => dispatch(updateFilter(filter, key)),
	}),
)(History));
