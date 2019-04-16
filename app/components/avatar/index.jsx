import React from 'react';
import PropTypes from 'prop-types';
import { svgAvatar } from 'echojs-ping';
import classnames from 'classnames';

import avatar from '../../assets/images/default-avatar.svg';

class Avatar extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			avatarSize: null,
			timeout: null,
			accountName: '',
		};

		this.listener = this.updateAvatarSize.bind(this);
	}

	componentDidMount() {
		this.updateAvatarSize();
		this.updateAccountName();
		window.addEventListener('resize', this.listener);
	}


	componentWillUnmount() {
		window.removeEventListener('resize', this.listener);
	}

	getSnapshotBeforeUpdate(prevProps) {
		const { timeout } = this.state;
		const { accountName } = this.props;

		if (prevProps.accountName !== accountName) {
			clearTimeout(timeout);
			this.setState({ timeout: setTimeout(() => this.updateAccountName(), 300) });
		}

		return null;
	}

	updateAccountName() {
		this.setState({ accountName: this.props.accountName });
	}

	updateAvatarSize() {
		const avatarSize = document.getElementsByClassName('avatar-image')[0].offsetHeight;
		if (avatarSize !== this.state.avatarSize) {
			this.setState({ avatarSize });
		}
	}

	render() {
		const { round } = this.props;
		const { avatarSize, accountName } = this.state;

		return (
			<div className={classnames('avatar-image', { round })}>
				{
					!accountName ? <img src={avatar} alt="avatar" /> : (
						<div dangerouslySetInnerHTML={{ __html: svgAvatar(accountName, avatarSize) }} />
					)
				}
			</div>
		);
	}

}

Avatar.propTypes = {
	accountName: PropTypes.string,
	round: PropTypes.bool,
};

Avatar.defaultProps = {
	accountName: '',
	round: false,
};

export default Avatar;
