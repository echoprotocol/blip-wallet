import Lottie from 'react-lottie';
import React from 'react';
import { Transition } from 'react-transition-group';
import PropTypes from 'prop-types';
import TweenMax from 'gsap';
import classnames from 'classnames';
import { TIME_FADE_LEFT_LOGO_ANIMATION, TIME_FADE_OUT_LOADING_ANIMATION } from '../../constants/animation-constans';

class AnimationLogo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isStopped: false,
			isPaused: false,
			left: false,
		};
		this.endHandler = this.endHandler.bind(this);
	}

	endHandler(n) {
		let endStateAnimation = {
			top: '8vh',
			ease: window.Power1.easeOut,
		};

		TweenMax.set(n, { top: '32vh' });
		TweenMax.to(n, TIME_FADE_OUT_LOADING_ANIMATION / 1000, endStateAnimation);

		if (this.props.moveAnimationToLeft) {
			setTimeout(() => this.setState({ left: true }), TIME_FADE_OUT_LOADING_ANIMATION - 100);

			endStateAnimation = {
				delay: TIME_FADE_OUT_LOADING_ANIMATION / 1000,
			};

			TweenMax.to(n, TIME_FADE_LEFT_LOGO_ANIMATION / 1000, endStateAnimation);
		}
	}

	render() {
		const defaultOptions = {
			loop: false,
			autoplay: true,
			animationData: this.props.data,
		};

		const defaultStyle = {
			position: 'relative',
		};

		const transitionStyles = {
			entered: { top: '32vh' },
		};

		return (
			<div className={
				classnames(
					'loading-animation-logo',
					{ left: this.state.left },
				)}
			>
				<Transition
					in={!this.props.in}
					mountOnEnter
					timeout={0}
					addEndListener={(n, done) => this.endHandler(n, done)}
				>
					{(state) => (
						<div style={{
							...defaultStyle,
							...transitionStyles[state],
						}}
						>
							<Lottie
								options={defaultOptions}
								isStopped={this.state.isStopped}
								isPaused={this.state.isPaused}
							/>
						</div>
					)}
				</Transition>
			</div>
		);
	}

}

AnimationLogo.propTypes = {
	data: PropTypes.object.isRequired,
	in: PropTypes.bool.isRequired,
	moveAnimationToLeft: PropTypes.bool.isRequired,
};

export default AnimationLogo;
