import { connect } from 'react-redux';

import BackupModal from '../../components/modals/backup';
import { getKeysByAccountId } from '../../actions/backup-actions';

export default connect(
	(state, props) => ({
		account: props.accountId ? state.echoCache.getIn(['accountsById', props.accountId]) : null,
	}),
	(dispatch) => ({
		getKeysByAccountId: (id) => dispatch(getKeysByAccountId(id)),
	}),

)(BackupModal);
