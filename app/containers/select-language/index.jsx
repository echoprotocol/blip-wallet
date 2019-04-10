import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { Button, Icon } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Animated } from 'react-animated-css';
import { FormattedMessage } from 'react-intl';

import { CREATE_PASSWORD } from '../../constants/routes';
import blipLogo from '../../assets/images/blip-logo.svg';
import { setValue, setLanguage } from '../../actions/global-actions';
import { EN_LOCALE, RU_LOCALE } from '../../constants/global-constants';

class SelectLanguage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isVisible: true,
		};
	}

	onSelect(key) {
		const { setLanguage: changeLanguage } = this.props;

		changeLanguage(key);
	}

	goForward() {

		const { history, setLanguageStorage } = this.props;

		this.setState({
			isVisible: false,
		});

		setTimeout(() => {
			history.push(CREATE_PASSWORD);
		}, 200);

		setLanguageStorage();
	}

	render() {
		const { isVisible } = this.state;
		const { language } = this.props;

		return (
			<div className="page">
				<a href="/" className="logo-wrap">
					<img src={blipLogo} alt="" />
				</a>
				<Animated
					className="lang-wrap"
					animationIn="fadeInRight"
					animationOut="fadeOutLeft"
					isVisible={isVisible}
				>
					<h3><FormattedMessage id="language.title" /></h3>

					<Dropdown
						className="dropdown-lang"
						onSelect={(key) => this.onSelect(key)}
					>
						<div className="dropdown-label">
							<FormattedMessage id="language.description" />
						</div>

						<Dropdown.Toggle variant="Info">
							<div className="lang-title">
								<FormattedMessage id={`language.${language}`} />
							</div>
							<span className="carret" />
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<PerfectScrollbar className="lang-scroll">
								<Dropdown.Item eventKey={EN_LOCALE}>
									<FormattedMessage id="language.en" />
								</Dropdown.Item>
								<Dropdown.Item eventKey={RU_LOCALE}>
									<FormattedMessage id="language.ru" />
								</Dropdown.Item>
							</PerfectScrollbar>
						</Dropdown.Menu>
					</Dropdown>

					<Button
						className="btn-primary arrow"
						to={CREATE_PASSWORD}
						onClick={() => this.goForward()}
						content={(
							<React.Fragment>
								<div className="text"><FormattedMessage id="language.proceed" /></div>
								<Icon className="arrow-right" />
							</React.Fragment>
						)}
					/>
				</Animated>
			</div>
		);
	}

}

SelectLanguage.propTypes = {
	history: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired,
	setLanguage: PropTypes.func.isRequired,
	setLanguageStorage: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		language: state.global.get('language'),
	}),
	(dispatch) => ({
		setLanguage: (value) => dispatch(setValue('language', value)),
		setLanguageStorage: () => dispatch(setLanguage()),
	}),
)(SelectLanguage);
