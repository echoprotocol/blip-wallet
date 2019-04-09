/* eslint-disable react/prop-types */ // TODO::
import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import localeEn from 'react-intl/locale-data/en';
import localeRu from 'react-intl/locale-data/ru';

import en from '../translations/en';
import ru from '../translations/ru';

import BlipDimmer from '../components/blip-dimmer';
import TranslateHelper from '../helpers/translate-helper';

addLocaleData([...localeEn, ...localeRu]);

class App extends React.Component {

	render() {
		const {
			children, loading, language,
		} = this.props;

		const messages = { en, ru };

		const flatten = TranslateHelper.flattenMessages(messages[language]);

		return (
			<IntlProvider locale={language} messages={flatten}>
				<React.Fragment>
					{children}
					{
						loading && (
							<BlipDimmer content={loading} />
						)
					}
				</React.Fragment>
			</IntlProvider>
		);
	}

}

App.propTypes = {
	language: PropTypes.string.isRequired,
	loading: PropTypes.string.isRequired,
};

export default connect(
	(state) => ({
		language: state.global.get('language'),
		loading: state.global.get('loading'),
	}),
	() => ({}),
)(App);
