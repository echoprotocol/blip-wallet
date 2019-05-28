import { connect } from 'react-redux';

import Settings from '../../components/settings';
import { changeNetwork } from '../../actions/setting-actions';

export default connect(
	(state) => ({
		networks: state.settings.get('networks'),
	}),
	(dispatch) => ({
		changeNetwork: (value) => dispatch(changeNetwork(value)),
	}),
)(Settings);
