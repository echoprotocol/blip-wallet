import { connect } from 'react-redux';

import Settings from '../../components/settings';
import { applySettings } from '../../actions/setting-actions';

export default connect(
	(state) => ({
		isConnected: state.global.get('isConnected'),
		currentNode: state.global.get('currentNode'),
		networks: state.global.get('networks'),
		loading: state.settings.get('loading'),
	}),
	(dispatch) => ({
		applySettings: (value) => dispatch(applySettings(value)),
	}),
)(Settings);
