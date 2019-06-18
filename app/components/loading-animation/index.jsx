import React from 'react';
import PropTypes from 'prop-types';
import AnimationLabel from './animation-label';
import AnimationLogo from './animation-logo';
import en from '../../translations/en';
import blipLoading from '../../assets/animations/blip-loading';
import { DELAY_SHOW_TEXT_ANIMATION } from '../../constants/animation-constans';


class LoadingAnimation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isShowText: false,
		};
	}

	componentDidMount() {
		setTimeout(() => this.changeVisibleText(), DELAY_SHOW_TEXT_ANIMATION);
	}

	componentWillUnmount() {
		this.changeVisibleText();
	}

	changeVisibleText() {
		const { isShowText } = this.state;
		this.setState({ isShowText: !isShowText });
	}

	render() {
		const { isShowText } = this.state;
		const { isLoaded, moveAnimationToLeft } = this.props;

		return (
			<div className="loading-animation">
				<AnimationLogo moveAnimationToLeft={moveAnimationToLeft} in={isLoaded} data={blipLoading} />
				<AnimationLabel in={isShowText && !isLoaded} data={en.animations.loading} />
			</div>
		);
	}

}

LoadingAnimation.propTypes = {
	isLoaded: PropTypes.bool.isRequired,
	moveAnimationToLeft: PropTypes.bool,
};

LoadingAnimation.defaultProps = {
	moveAnimationToLeft: false,
};

export default LoadingAnimation;
