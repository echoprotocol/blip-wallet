import React from 'react';
import { TweenLite } from 'gsap';
import { Transition } from 'react-transition-group';
import PropTypes from 'prop-types';
import { TIME_FADE_OUT_LOADING_ANIMATION } from '../../constants/animation-constans';

class AnimationLabel extends React.Component {

	endHandler(n, done) {
		if (this.props.in) {
			TweenLite.fromTo(n, 1, { y: 170, opacity: 0 }, {
				y: 0,
				opacity: 0.5,
				ease: window.Power1.easeOut,
				onComplete: done,
			});
		} else {
			TweenLite.to(n, TIME_FADE_OUT_LOADING_ANIMATION * 0.001, {
				opacity: 0,
				y: 130,
				onComplete: done,
			});
		}
	}

	render() {
		return (
			<div className="loading-animation-text">
				<Transition
					in={this.props.in}
					mountOnEnter
					unmountOnExit
					addEndListener={(n, done) => this.endHandler(n, done)}
				>
					<div>{this.props.data}</div>
				</Transition>
			</div>
		);
	}

}

AnimationLabel.propTypes = {
	data: PropTypes.string.isRequired,
	in: PropTypes.bool.isRequired,
};

export default AnimationLabel;
