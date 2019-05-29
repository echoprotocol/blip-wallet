import { connect } from 'react-redux';


import Receive from '../../components/receive';
import { updateBalance } from '../../actions/balance-actions';
import {
	setFormError, setFormValue, setValue,
} from '../../actions/form-actions';
import { FORM_RECEIVE } from '../../constants/form-constants';
import Services from '../../services';
import { ECHO_ASSET_ID } from '../../constants/global-constants';


const historySelector = Services.getSelector().getHistorySelector();
const walletBalanceSelector = Services.getSelector().getWalletBalanceSelector();
const transferBalanceSelector = Services.getSelector().getTransferBalanceSelector();

export default connect(
	(state) => ({
		form: state.form.get(FORM_RECEIVE),
		accounts: state.global.get('accounts'),
		balances: transferBalanceSelector(state),
		balancesAccounts: walletBalanceSelector(state),
		histories: historySelector(state),
		tokens: state.wallet.get('tokens'),
		hiddenAssets: state.wallet.get('hiddenAssets').get(Services.getUserStorage().getNetworkId()),
		echoAsset: state.echoCache.getIn(['assetByAssetId', ECHO_ASSET_ID]),
	}),
	(dispatch) => ({
		updateBalance: () => dispatch(updateBalance()),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_RECEIVE, field, value)),
		setValue: (field, value) => dispatch(setValue(FORM_RECEIVE, field, value)),
		setFormError: (field, value) => dispatch(setFormError(FORM_RECEIVE, field, value)),
	}),
)(Receive);
