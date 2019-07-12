import { connect } from 'react-redux';

import { FORM_SEND } from '../../constants/form-constants';
import {
	clearForm, setFormError, setFormValue, setValue,
} from '../../actions/form-actions';
import {
	checkAccount, send, setFeeFormValue, setMinAmount, changeAccount,
} from '../../actions/transfer-actions';

import Send from '../../components/send';
import Services from '../../services';

const balanceSelector = Services.getSelector().getTransferBalanceSelector();

export default connect(
	(state) => ({
		form: state.form.get(FORM_SEND),
		accounts: state.global.get('accounts'),
		balances: balanceSelector(state),
		tokens: state.wallet.get('tokens'),
		loading: state.global.get('loading'),
		hiddenAssets: state.wallet.get('hiddenAssets').get(Services.getUserStorage().getNetworkId()),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SEND, field, value)),
		checkAccount: (from, to) => dispatch(checkAccount(from, to)),
		setValue: (field, value) => dispatch(setValue(FORM_SEND, field, value)),
		setFormError: (field, value) => dispatch(setFormError(FORM_SEND, field, value)),
		send: () => dispatch(send()),
		setFeeFormValue: () => dispatch(setFeeFormValue()),
		clearForm: () => dispatch(clearForm(FORM_SEND)),
		setMinAmount: () => dispatch(setMinAmount()),
		changeAccount: (id) => dispatch(changeAccount(id)),
	}),
)(Send);
