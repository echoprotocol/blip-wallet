import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import { Button, Icon } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Animated } from 'react-animated-css';
import { CREATE_PASSWORD } from '../../constants/routes';
import blipLogo from '../../assets/images/blip-logo.svg';

class SelectLanguage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isVisible: true,
		};
	}

	goForward() {

		const { history } = this.props;

		this.setState({
			isVisible: false,
		});

		setTimeout(() => {
			history.push(CREATE_PASSWORD);
		}, 200);
	}

	render() {
		const { isVisible } = this.state;
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
					<h3>Choose your preferred language</h3>

					<Dropdown
						className="dropdown-lang"
					>
						<div className="dropdown-label">
							language
						</div>

						<Dropdown.Toggle variant="Info">
							<div className="lang-title">English</div>
							<span className="carret" />
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<PerfectScrollbar className="lang-scroll">
								<Dropdown.Item
									eventKey="1"
								>
									English
								</Dropdown.Item>
								<Dropdown.Item eventKey="2">
									Русский (Russian)
								</Dropdown.Item>
								<Dropdown.Item eventKey="3">
									Deutsch (German)
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
								<div className="text">Proceed</div>
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
};

export default SelectLanguage;
