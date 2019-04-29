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
import Services from '../services';
import Modal from './modal';

import {
	CREATE_PASSWORD, AUTHORIZATION, PUBLIC_ROUTES, LOCKED_ROUTES, SIDE_MENU_ROUTES, RESTORE_PASSWORD, WALLET,
} from '../constants/routes-constants';
import { LOCK_TIMEOUT, LOCK_TIMER_EVENTS } from '../constants/global-constants';

import { lockApp } from '../actions/global-actions';
import { FORM_CREATE_PASSWORD } from '../constants/form-constants';

addLocaleData([...localeEn, ...localeRu]);

class App extends React.Component {


	componentDidMount() {
		this.checkLocation();
	}

	componentDidUpdate() {
		this.checkLocation();
	}

	onIdle() {
		const { pathname } = this.props;

		if (LOCKED_ROUTES.includes(pathname)) {
			this.props.lock();
		}
	}

	async checkLocation() {

		if (!this.props.inited) {
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
				this.props.history.push(WALLET);
			}

		}

		if (!routed && [RESTORE_PASSWORD].includes(pathname)) {
			const userStorage = Services.getUserStorage();

			const doesDBExist = await userStorage.doesDBExist();

			if (!doesDBExist) {
				this.props.history.push(CREATE_PASSWORD);
			}

		}

		if (!routed && [WALLET].includes(pathname)) {
			const { locked, accounts } = this.props;

			if (!locked && !accounts.size) {
				this.props.history.push(AUTHORIZATION);
			}
		}

		return true;

	}

	render() {

		const {
			children, loading, locked,
			pathname, language,
		} = this.props;

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
					/>

					{ (PUBLIC_ROUTES.includes(pathname) || locked) && <div className="bg" />}

					<div
						className={
							classnames(
								'global-wrap',
								{ withSidebar: SIDE_MENU_ROUTES.includes(pathname) },
							)
						}
					>

						{locked && LOCKED_ROUTES.includes(pathname)
							? (
								<Unlock />
							) : (
								<React.Fragment>
									{children}
									<Modal />
								</React.Fragment>
							) }


					</div>
					{
						loading && (
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
	inited: PropTypes.bool,
};

App.defaultProps = {
	inited: false,
	locked: true,
};

export default connect(
	(state) => ({
		inited: state.global.get('inited'),
		language: state.global.get('language'),
		loading: state.global.get('loading'),
		locked: state.global.get('locked'),
		accounts: state.global.get('accounts'),
		loadingCreatePass: state.form.getIn([FORM_CREATE_PASSWORD, 'loading']),
		pathname: state.router.location.pathname,
	}),
	(dispatch) => ({
		lock: () => dispatch(lockApp()),
	}),
)(withRouter(App));
