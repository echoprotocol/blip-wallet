import { connect } from 'react-redux';
import FrozenFunds from '../../components/frozen-funds';
import { getFrozenBalance } from '../../actions/balance-actions';

export default connect(
	(state) => ({
		frozenBalances: state.wallet.get('frozenBalances'),
	}),

	(dispatch) => ({
		getFrozenBalance: () => dispatch(getFrozenBalance()),
	}),
)(FrozenFunds);
