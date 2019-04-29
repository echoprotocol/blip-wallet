import React from 'react';
import PropTypes from 'prop-types';
import { svgAvatar } from 'echojs-ping';
import classnames from 'classnames';

import avatar from '../../assets/images/default-avatar.svg';

class Avatar extends React.Component {

	static updateAccountName(props) {
		return { accountName: props.accountName };
	}

	constructor(props) {
		super(props);

		this.state = {
			avatarSize: null,
			accountName: '',
		};

		this.listener = this.updateAvatarSize.bind(this);
	}

	componentDidMount() {
		this.updateAvatarSize();
		window.addEventListener('resize', this.listener);
		window.addEventListener('load', this.listener);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const { accountName } = prevState;
		const { reset } = nextProps;
		if (accountName !== nextProps.accountName || (nextProps.reset && !reset)) {
			return Avatar.updateAccountName(nextProps);
		}
		return null;
	}

	shouldComponentUpdate(nextProps) {
		if (nextProps.reset) return true;
		if (nextProps.loading) return false;
		if (this.state.accountName === nextProps.accountName) return false;
		return true;
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.listener);
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
	loading: PropTypes.bool,
	reset: PropTypes.bool,
};

Avatar.defaultProps = {
	accountName: '',
	round: false,
	loading: false,
	reset: true,
};

export default Avatar;
