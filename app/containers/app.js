import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import { Animated } from 'react-animated-css';
import localeEn from 'react-intl/locale-data/en';
import localeRu from 'react-intl/locale-data/ru';

import en from '../translations/en';
import ru from '../translations/ru';

import BlipDimmer from '../components/blip-dimmer';
import TranslateHelper from '../helpers/translate-helper';

import SideMenu from '../components/side-menu';
import Unlock from '../components/unlock-wallet';
import { PUBLIC_ROUTES } from '../constants/routes';

addLocaleData([...localeEn, ...localeRu]);

class App extends React.Component {

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
						className="global-wrap"
					>
						{locked
							? (
								<Animated
									animationIn="fadeInRightBig"
									animationOut="fadeOutLeft"
									isVisible={locked}
									className="unlock-page"
									animateOnMount={false}
								>
									<Unlock />
								</Animated>
							) : (
								<Animated
									animationIn="fadeInRightBig"
									animationOut="fadeOutLeft"
								>
									{children}
								</Animated>
							) }


					</div>
					{
						loading && (
							<BlipDimmer content={loading} />
						)
					}

					{ !PUBLIC_ROUTES.includes(pathname) && <SideMenu /> }
				</React.Fragment>
			</IntlProvider>

		);
	}

}

App.propTypes = {
	language: PropTypes.string.isRequired,
	loading: PropTypes.string.isRequired,
	pathname: PropTypes.string.isRequired,
	locked: PropTypes.bool.isRequired,
	children: PropTypes.element.isRequired,
};

export default connect(
	(state) => ({
		language: state.global.get('language'),
		loading: state.global.get('loading'),
		locked: state.global.get('locked'),
		pathname: state.router.location.pathname,
	}),
	() => ({}),
)(App);
