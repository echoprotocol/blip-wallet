import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { IntlProvider, addLocaleData } from 'react-intl';
import classnames from 'classnames';
import IdleTimer from 'react-idle-timer';

import { withRouter } from 'react-router';

import localeEn from 'react-intl/locale-data/en';
import localeRu from 'react-intl/locale-data/ru';

import en from '../translations/en';
import ru from '../translations/ru';

import BlipDimmer from '../components/blip-dimmer';
import TranslateHelper from '../helpers/translate-helper';

import SideMenu from '../components/side-menu';
import Unlock from '../components/unlock-wallet';
import Toolbar from '../components/toolbar';
import Services from '../services';
import Modals from './modals';
import { setValue, startAnimation } from '../actions/animation-actions';
import ViewHelper from '../helpers/view-helper';

import {
	CREATE_PASSWORD,
	AUTHORIZATION,
	PUBLIC_ROUTES,
	LOCKED_ROUTES,
	SIDE_MENU_ROUTES,
	RESTORE_PASSWORD,
	UNLOCK,
} from '../constants/routes-constants';
import { LOCK_TIMEOUT, LOCK_TIMER_EVENTS } from '../constants/global-constants';

import { lockApp, setInValue } from '../actions/global-actions';


import { FORM_CREATE_PASSWORD } from '../constants/form-constants';
import LoadingAnimation from '../components/loading-animation';
import {
	TIME_FADE_LEFT_LOGO_ANIMATION,
	TIME_FADE_OUT_LOADING_ANIMATION,
	TIME_SHOW_LOADING_ANIMATION,
	WAITING_ANIMATION, NEXT_PAGE_SETUP_TIME,
} from '../constants/animation-constants';

addLocaleData([...localeEn, ...localeRu]);

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			runStartAnimation: props.initedAnimation,
			stayLogoAnimation: false,
		};

		this.cancelShowingAnimation = this.cancelShowingAnimation.bind(this);
		this.getNextPageAnimationTimeout = this.getNextPageAnimationTimeout.bind(this);
		this.setLoadAnimationEnd = this.setLoadAnimationEnd.bind(this);
	}

	componentDidMount() {
		this.checkLocation();
		const { initedAnimation } = this.props;
		if (initedAnimation) return;
		this.cancelShowingAnimation();
	}

	componentDidUpdate() {
		this.checkLocation();
	}

	onIdle() {
		const { pathname } = this.props;

		if (LOCKED_ROUTES.includes(pathname)) {
			this.props.setValue(WAITING_ANIMATION, 'active', true);
			this.props.lock();
		}
	}

	onIdleActive() {
		this.props.setValue(WAITING_ANIMATION, 'active', false);
	}

	setLoadAnimationEnd(timeForMovingToLeft) {
		if (timeForMovingToLeft === 0) {
			this.props.setValue(UNLOCK, 'showLogo', true);
			this.props.setValue(CREATE_PASSWORD, 'showLogo', true);
			this.props.setInValue('inited', { animation: true });
		} else {
			this.setState({ stayLogoAnimation: true });
		}
	}

	async getNextPageAnimationTimeout() {
		const userStorage = Services.getUserStorage();
		const doesDBExist = await userStorage.doesDBExist();

		if (doesDBExist) {
			this.props.startAnimation(UNLOCK, 'isVisible', true);
			return 0;
		}
		this.props.startAnimation(CREATE_PASSWORD, 'isVisible', true);
		return TIME_FADE_LEFT_LOGO_ANIMATION;

	}

	async checkLocation() {

		if (!this.props.initedApp) {
			return false;
		}

		const { loadingCreatePass } = this.props;
		if (loadingCreatePass) {
			return false;
		}

		const { pathname } = this.props.history.location;

		let routed = false;


		if (!routed && LOCKED_ROUTES.includes(pathname)) {
			const userStorage = Services.getUserStorage();

			const doesDBExist = await userStorage.doesDBExist();

			if (!doesDBExist) {
				routed = true;
				this.props.history.push(CREATE_PASSWORD);
			}
		}

		if (!routed && [CREATE_PASSWORD].includes(pathname)) {

			routed = true;

			const userStorage = Services.getUserStorage();
			const doesDBExist = await userStorage.doesDBExist();

			if (doesDBExist) {
				this.props.history.push(AUTHORIZATION);
			}
		}

		if (!routed && [RESTORE_PASSWORD].includes(pathname)) {
			const userStorage = Services.getUserStorage();

			const doesDBExist = await userStorage.doesDBExist();

			if (!doesDBExist) {
				this.props.history.push(CREATE_PASSWORD);
			}

		}

		if (!routed && SIDE_MENU_ROUTES.includes(pathname)) {
			const { locked, accounts } = this.props;

			if (!locked && !accounts.size) {
				this.props.history.push(AUTHORIZATION);
			}
		}

		return true;

	}

	async cancelShowingAnimation() {

		let timeForMovingToLeft = 0;
		this.props.setValue(UNLOCK, 'showLogo', false);
		this.props.setValue(CREATE_PASSWORD, 'showLogo', false);

		ViewHelper.timeout(async () => {

			timeForMovingToLeft = await this.getNextPageAnimationTimeout();

		}, TIME_SHOW_LOADING_ANIMATION - NEXT_PAGE_SETUP_TIME)
			.then(() => ViewHelper.timeout(() => {

				this.setState({ runStartAnimation: true });

			}, NEXT_PAGE_SETUP_TIME))
			.then(() => ViewHelper.timeout(() => {

				this.setLoadAnimationEnd(timeForMovingToLeft);

			}, TIME_FADE_OUT_LOADING_ANIMATION + timeForMovingToLeft));
	}


	render() {

		const {
			children, loading, locked,
			pathname, language, initedAnimation,
			initedApp, moveAnimationToLeft,
		} = this.props;

		const { runStartAnimation } = this.state;

		const messages = { en, ru };

		const flatten = TranslateHelper.flattenMessages(messages[language]);

		return (
			<IntlProvider locale={language} messages={flatten}>
				<React.Fragment>
					<IdleTimer
						element={document}
						onIdle={() => this.onIdle()}
						timeout={LOCK_TIMEOUT}
						events={LOCK_TIMER_EVENTS}
						onActive={() => this.onIdleActive()}
					/>
					<Toolbar />
					{ (PUBLIC_ROUTES.includes(pathname) || locked) && <div className="bg" />}

					<div
						className={
							classnames(
								'global-wrap',
								{ withSidebar: SIDE_MENU_ROUTES.includes(pathname) },
							)
						}
					>
						{!initedAnimation && <LoadingAnimation moveAnimationToLeft={moveAnimationToLeft} isLoaded={runStartAnimation} />}

						{(initedAnimation || this.state.stayLogoAnimation) && (
							locked && LOCKED_ROUTES.includes(pathname)
								? (
									<Unlock />
								) : (
									<React.Fragment>
										{children}
										<Modals />
									</React.Fragment>
								)
						)}

					</div>
					{
						initedApp && loading && (
							<BlipDimmer content={loading} />
						)
					}

					{ !locked && SIDE_MENU_ROUTES.includes(pathname) && <SideMenu /> }

				</React.Fragment>
			</IntlProvider>

		);
	}

}

App.propTypes = {
	language: PropTypes.string.isRequired,
	loading: PropTypes.string.isRequired,
	pathname: PropTypes.string.isRequired,
	children: PropTypes.element.isRequired,
	lock: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	accounts: PropTypes.object.isRequired,
	loadingCreatePass: PropTypes.bool.isRequired,
	locked: PropTypes.bool,
	setValue: PropTypes.func.isRequired,
	initedApp: PropTypes.bool,
	initedAnimation: PropTypes.bool.isRequired,
	setInValue: PropTypes.func.isRequired,
	startAnimation: PropTypes.func.isRequired,
	moveAnimationToLeft: PropTypes.bool.isRequired,
};

App.defaultProps = {
	initedApp: false,
	locked: true,
};

export default connect(
	(state) => ({
		initedApp: state.global.getIn(['inited', 'app']),
		language: state.global.get('language'),
		loading: state.global.get('loading'),
		locked: state.global.get('locked'),
		accounts: state.global.get('accounts'),
		loadingCreatePass: state.form.getIn([FORM_CREATE_PASSWORD, 'loading']),
		pathname: state.router.location.pathname,
		initedAnimation: state.global.getIn(['inited', 'animation']),
		moveAnimationToLeft: state.animation.getIn([CREATE_PASSWORD, 'isVisible']) && !state.animation.getIn([UNLOCK, 'isVisible']),
	}),
	(dispatch) => ({
		lock: () => dispatch(lockApp()),
		setValue: (type, field, value) => dispatch(setValue(type, field, value)),
		setInValue: (field, value) => dispatch(setInValue(field, value)),
		startAnimation: (type, field, value) => dispatch(startAnimation(type, field, value)),
	}),
)(withRouter(App));
