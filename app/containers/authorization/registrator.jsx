import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-animated-css';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';

import { ECHO_ASSET_PRECISION, ECHO_ASSET_SYMBOL } from '../../constants/global-constants';
import FormatHelper from '../../helpers/format-helper';

class Registrator extends React.Component {

	onSelect(accountId) {
		const { registrators } = this.props;

		this.props.changeRegistrator(accountId, registrators.getIn([accountId, 'name']));
	}

	onChangeType(e, isPublic) {
		const { form } = this.props;

		if (form.public === isPublic) {
			return;
		}

		this.props.changeRegistratorType(isPublic);
	}

	renderDropdown(form, registrators) {
		return (
			<Dropdown className="pink" onSelect={(key) => this.onSelect(key)}>
				<Dropdown.Toggle variant="Info">
					<span className="dropdown-toggle-text">
						{form.account ? form.account : registrators.first().get('name')}
					</span>
					<span className="carret" />
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<PerfectScrollbar>
						{
							registrators.map((r, id) => (
								<Dropdown.Item key={r.get('name')} eventKey={id}>
									{r.get('name')}
								</Dropdown.Item>
							)).toList()
						}
					</PerfectScrollbar>
				</Dropdown.Menu>
			</Dropdown>
		);
	}

	render() {

		const { isVisible, registrators, form } = this.props;

		return (
			<Animated
				className="line registrator"
				animationIn="fadeInRight"
				animationOut="fadeOutLeft"
				isVisible={isVisible}
			>
				<div className="line-label">
					<span className="line-label-text"><FormattedMessage id="account.create.registrator.title" /></span>
				</div>
				<div className="line-content">
					<div className="radio">
						<input
							type="checkbox"
							name="registration-type"
							id="registartor-1"
							checked={form.public}
							onChange={(e) => this.onChangeType(e, true)}
						/>
						<label htmlFor="registartor-1" className="checkbox-label">
							<span className="handler" />
							<div className="label-text">
								<FormattedMessage id="account.create.registrator.public.title" />
							</div>
						</label>
						<div className="hints">
							<div className="hint"><FormattedMessage id="account.create.registrator.public.hint" /></div>
						</div>
					</div>
					<div className="radio">
						<input
							type="checkbox"
							name="registration-type"
							id="registartor-2"
							checked={!form.public}
							disabled={!registrators.size}
							onChange={(e) => this.onChangeType(e, false)}
						/>
						<label htmlFor="registartor-2" className="checkbox-label">
							<span className="handler" />
							<div className="label-text">
								<FormattedMessage id="account.create.registrator.account.title" />
							</div>
						</label>
						<div className="hints">
							{
								registrators.size ? (
									<div className="hint">
										<span className="balance">
											{`${FormatHelper.formatAmount(form.fee, ECHO_ASSET_PRECISION)} ${ECHO_ASSET_SYMBOL}`}
										</span>
										<FormattedMessage id="account.create.registrator.account.hint1" />
										{this.renderDropdown(form, registrators)}
									</div>
								) : <div className="hint"><FormattedMessage id="account.create.registrator.account.hint2" /></div>
							}
						</div>
					</div>
				</div>

			</Animated>
		);
	}

}

Registrator.propTypes = {
	isVisible: PropTypes.bool,
	registrators: PropTypes.object.isRequired,
	form: PropTypes.object.isRequired,
	changeRegistratorType: PropTypes.func.isRequired,
	changeRegistrator: PropTypes.func.isRequired,
};

Registrator.defaultProps = {
	isVisible: true,
};

export default Registrator;
