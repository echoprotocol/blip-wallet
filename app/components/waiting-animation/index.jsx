import React from 'react';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';

import blipWaiting from '../../assets/animations/blip-waiting';
import {
	DELAY_WAITING_ANIMATION,
	LOOP_LOGO_COUNT,
} from '../../constants/animation-constants';

class WaitingAnimation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isStopped: true,
			animationTimeout: null,
		};
	}

	componentDidMount() {
		if (this.props.active) {
			this.setState({
				animationTimeout: setTimeout(() => {
					this.initAnimation(this.props.active);
				}, DELAY_WAITING_ANIMATION),
			});
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.active !== prevProps.active) {
			this.initAnimation(this.props.active);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.state.animationTimeout);
	}

	initAnimation(active) {
		this.setState({ isStopped: !active });

	}

	loop(loop) {
		if (loop.currentLoop > LOOP_LOGO_COUNT) {
			this.setState({ isStopped: true });
			this.setState({
				animationTimeout: setTimeout(() => {
					this.setState({ isStopped: false });
				}, DELAY_WAITING_ANIMATION),
			});
		}
	}

	render() {
		const defaultOptions = {
			loop: true,
			autoplay: false,
			animationData: blipWaiting,
		};

		return (
			<div className="animation-logo">
				<Lottie
					options={defaultOptions}
					isStopped={this.state.isStopped}
					eventListeners={
						[
							{
								eventName: 'loopComplete',
								callback: (loop) => this.loop(loop),
							},
						]
					}
				/>
			</div>
		);
	}

}

WaitingAnimation.propTypes = {
	active: PropTypes.bool.isRequired,
};


export default WaitingAnimation;
