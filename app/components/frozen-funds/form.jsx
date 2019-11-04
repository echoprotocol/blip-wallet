import React from 'react';
import {
	Input, Button, Icon, Popup,
} from 'semantic-ui-react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Avatar from '../avatar';

class FrozenFundsForm extends React.Component {

	render() {
		const { intl } = this.props;
		const aboutText = intl.formatMessage({ id: 'frozenFunds.form.about' });
		return (
			<div>
				<div className="return">
					<Button
						className="btn-return"
						content={(
							<React.Fragment>
								<Icon className="arrow-left" />
								<div className="text"><FormattedMessage id="frozenFunds.form.return" /></div>
							</React.Fragment>
						)}
					/>
				</div>
				<section className="frozen-form-wrap">
					<h1 className="page-title"><FormattedMessage id="frozenFunds.form.title" /></h1>

					<div className="form">

						<div className="line">
							<div className="line-label">
								<span className="line-label-text"><FormattedMessage id="frozenFunds.form.amount" />, ECHO</span>
							</div>
							<div className="line-content">
								<Input
									className="white"
									// TODO error/success
									name="amount"
									placeholder="0.001"
									autoFocus
								/>
							</div>
						</div>

						<div className="line">
							<div className="line-label">
								<span className="line-label-text"><FormattedMessage id="frozenFunds.form.period" /></span>
							</div>

							<div className="line-content">
								<Dropdown className="white select-period">
									<Dropdown.Toggle variant="Info">
										<span className="dropdown-toggle-text">
											<FormattedMessage id="frozenFunds.form.periodPlaceholder" />
										</span>
										<span className="carret" />
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<PerfectScrollbar>
											<Dropdown.Item>
												3 <FormattedMessage id="frozenFunds.form.months" />
											</Dropdown.Item>
											<Dropdown.Item>
												6 <FormattedMessage id="frozenFunds.form.months" />
											</Dropdown.Item>
											<Dropdown.Item>
												12 <FormattedMessage id="frozenFunds.form.months" />
											</Dropdown.Item>
										</PerfectScrollbar>
									</Dropdown.Menu>
								</Dropdown>
							</div>
							<div className="line">
								<div className="line-label">
									<span className="line-label-text">
										<FormattedMessage id="frozenFunds.form.coef" />
										<Popup
											content={aboutText}
											className="tooltip-frozen"
											trigger={<Icon className="icon-info" />}
										/>
									</span>

								</div>
								<div className="line-content">
									<Input
										className="white"
										name="Coefficient"
										placeholder="2.5"
										disabled
									/>
								</div>
							</div>
						</div>

						<div className="line">
							<div className="line-label">
								<span className="line-label-text"><FormattedMessage id="frozenFunds.form.fee" />, ECHO</span>
							</div>
							<div className="line-content">
								<Input
									className="white"
									name="Fee"
									placeholder="0.00001"
									disabled
								/>
							</div>
						</div>

						<div className="line">
							<div className="line-label">
								<span className="line-label-text"><FormattedMessage id="frozenFunds.form.from" /></span>
							</div>
							<div className="line-content">
								<Dropdown className="white select-account">
									<Dropdown.Toggle variant="Info">
										<Avatar accountName="test" />
										<span className="dropdown-toggle-text">
											<FormattedMessage id="frozenFunds.form.fromPlaceholder" />
										</span>
										<span className="carret" />
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<PerfectScrollbar>
											<Dropdown.Item>
												Vasya
											</Dropdown.Item>
											<Dropdown.Item>
												Grisha
											</Dropdown.Item>
										</PerfectScrollbar>
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</div>
					</div>
				</section>
				<section className="frozen-btn-wrap">
					<Button
						className="btn-primary white"
						content={(
							<div className="text"><FormattedMessage id="frozenFunds.form.buttonTitle" /></div>
						)}
						onClick={() => this.onApply()}
					/>
					<Button
						className="btn-gray round"
						content={(
							<div className="text"><FormattedMessage id="frozenFunds.form.buttonCancel" /></div>
						)}
						onClick={() => this.onCancel()}
					/>
				</section>
			</div>
		);
	}

}

FrozenFundsForm.propTypes = {
	intl: intlShape.isRequired,
};

export default injectIntl(FrozenFundsForm);
