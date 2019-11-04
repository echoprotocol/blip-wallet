import { connect } from 'react-redux';
import FrozenFunds from '../../components/frozen-funds';
import { getFrozenBalance } from '../../actions/balance-actions';
import { FORM_FREEZE } from '../../constants/form-constants';
import {
	clearForm, setFormError, setFormValue, setValue,
} from '../../actions/form-actions';
import {
	freezeFunds, setFeeFormValue, setMinAmount, changeAccount,
} from '../../actions/freeze-funds';

import Services from '../../services';

const balanceSelector = Services.getSelector().getTransferBalanceSelector();

export default connect(
	(state) => ({
		form: state.form.get(FORM_FREEZE),
		accounts: state.global.get('accounts'),
		balances: balanceSelector(state),
		loading: state.global.get('loading'),
		hiddenAssets: state.wallet.get('hiddenAssets').get(Services.getUserStorage().getNetworkId()),
		frozenBalances: state.wallet.get('frozenBalances'),
		filter: state.wallet.getIn(['history', 'filter']),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_FREEZE, field, value)),
		setValue: (field, value) => dispatch(setValue(FORM_FREEZE, field, value)),
		setFormError: (field, value) => dispatch(setFormError(FORM_FREEZE, field, value)),
		freezeFunds: () => dispatch(freezeFunds()),
		setFeeFormValue: () => dispatch(setFeeFormValue()),
		clearForm: () => dispatch(clearForm(FORM_FREEZE)),
		setMinAmount: () => dispatch(setMinAmount()),
		getFrozenBalance: () => dispatch(getFrozenBalance()),
		changeAccount: (id) => dispatch(changeAccount(id)),
	}),
)(FrozenFunds);
