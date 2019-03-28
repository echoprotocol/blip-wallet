import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Button, Icon } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import blipLogo from '../../assets/images/blip-logo.svg';

class SelectLanguage extends React.Component {

	render() {

		return (
			<div className="main-bg">
				<a href="/" className="logo-wrap">
					<img src={blipLogo} alt="" />

				</a>
				<div className="lang-wrap">
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
						content={(
							<React.Fragment>
								<div className="text">Proceed</div>
								<Icon className="arrow-right" />
							</React.Fragment>
						)}
					/>
				</div>
			</div>
		);
	}

}

export default SelectLanguage;
