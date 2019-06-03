import { connect } from 'react-redux';
import { Set } from 'immutable';

import {
	toggleVisibiltyAsset,
	initHiddenAssets,
	initTokens,
	saveSelectedAccounts,
	updateBalance,
} from '../../actions/balance-actions';
import { setLastTransaction } from '../../actions/transaction-actions';
import Wallet from '../../components/wallet';
import Services from '../../services';

const historySelector = Services.getSelector().getHistorySelector();
const balanceSelector = Services.getSelector().getSelectedAccountBalancesSelector();

export default connect(
	(state) => ({
		accounts: state.global.get('accounts'),
		hiddenAssets: state.wallet.get('hiddenAssets').get(Services.getUserStorage().getNetworkId()) || new Set(),
		language: state.global.get('language'),
		currentNode: state.global.get('currentNode'),
		localNodePercent: state.global.get('localNodePercent'),
		platform: state.global.get('platform'),
		balances: balanceSelector(state),
		transaction: state.wallet.get('transaction'),
		histories: historySelector(state),
		tokens: state.wallet.get('tokens'),
	}),

	(dispatch) => ({
		updateBalance: () => dispatch(updateBalance()),
		setTransaction: () => dispatch(setLastTransaction()),
		saveSelectedAccounts: (accounts) => dispatch(saveSelectedAccounts(accounts)),
		toggleVisibiltyAsset: (idAsset) => dispatch(toggleVisibiltyAsset(idAsset)),
		initHiddenAssets: () => dispatch(initHiddenAssets()),
		updateTokens: () => dispatch(initTokens()),
	}),
)(Wallet);
