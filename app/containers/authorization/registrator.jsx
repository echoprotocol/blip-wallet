import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-animated-css';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';


class Registrator extends React.Component {

	render() {

		const { isVisible } = this.props;
		return (
			<Animated
				className="line registrator"
				animationIn="fadeInRight"
				animationOut="fadeOutLeft"
				isVisible={isVisible}
			>
				<div className="line-label">
					<span className="line-label-text">Registration type</span>
				</div>
				<div className="line-content">
					<div className="radio">
						<input type="checkbox" name="registration-type" id="registartor-1" />
						<label htmlFor="registartor-1" className="checkbox-label">
							<span className="handler" />
							<div className="label-text">
								Public registartor
							</div>
						</label>
						<div className="hints">
							<div className="hint">Free registration but account wont participate in consensus</div>
						</div>
					</div>
					<div className="radio">
						<input type="checkbox" name="registration-type" id="registartor-2" />
						<label htmlFor="registartor-2" className="checkbox-label">
							<span className="handler" />
							<div className="label-text">
								Register with an existing account
							</div>
						</label>
						<div className="hints">
							<div className="hint">
								<span className="balance">0.00005 ECHO</span>
								will be charged upon creating from following account:
								<Dropdown className="pink">
									<Dropdown.Toggle variant="Info">
										<span className="dropdown-toggle-text">
											Homersimpson43
										</span>
										<span className="carret" />
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<PerfectScrollbar>

											<Dropdown.Item eventKey={0}>
												1
											</Dropdown.Item>
											<Dropdown.Item eventKey={1}>
												2
											</Dropdown.Item>
										</PerfectScrollbar>
									</Dropdown.Menu>
								</Dropdown>

							</div>
						</div>
					</div>
				</div>

			</Animated>
		);
	}

}

Registrator.propTypes = {
	isVisible: PropTypes.bool,
};

Registrator.defaultProps = {
	isVisible: true,
};

export default Registrator;
