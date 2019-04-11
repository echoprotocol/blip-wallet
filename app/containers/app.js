import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import classnames from 'classnames';
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
import {
	SELECT_LANGUAGE, CREATE_PASSWORD, AUTHORIZATION, PUBLIC_ROUTES, LOCKED_ROUTES, SIDE_MENU_ROUTES,
} from '../constants/routes-constants';
import LanguageService from '../services/language';

addLocaleData([...localeEn, ...localeRu]);

class App extends React.Component {

	componentDidMount() {
		this.checkLocation();
	}

	componentDidUpdate() {
		this.checkLocation();
	}

	async checkLocation() {

		if (!this.props.inited) {
			return false;
		}

		const { pathname } = this.props.history.location;
		const language = LanguageService.getCurrentLanguage();

		let routed = false;

		if (!routed && !language && ![SELECT_LANGUAGE].includes(pathname)) {
			this.props.history.push(SELECT_LANGUAGE);
			routed = true;
		}

		if (!routed && language && [SELECT_LANGUAGE].includes(pathname)) {
			this.props.history.push(CREATE_PASSWORD);
			routed = true;
		}

		if (!routed && [CREATE_PASSWORD].includes(pathname)) {

			const userStorage = Services.getUserStorage();

			const doesDBExist = await userStorage.doesDBExist();

			if (doesDBExist) {
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

					{ (PUBLIC_ROUTES.includes(pathname) || locked) && <div className="bg" />}

					<div
						className={
							classnames(
								'global-wrap',
								{ withSidebar: SIDE_MENU_ROUTES.includes(pathname) },
							)
						}
					>

						{locked && LOCKED_ROUTES.includes(pathname) && PUBLIC_ROUTES.includes(pathname)
							? (
								<Unlock />
							) : (
								<React.Fragment>{children}</React.Fragment>
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
	history: PropTypes.object.isRequired,
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
		pathname: state.router.location.pathname,
	}),
	() => ({}),
)(withRouter(App));
