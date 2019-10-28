import React from 'react';
import {
	Input, Button, Icon, Popup,
} from 'semantic-ui-react';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Avatar from '../avatar';

class FrozenFundsForm extends React.Component {

	render() {
		return (
			<div>
				<div className="return">
					<Button
						className="btn-return"
						content={(
							<React.Fragment>
								<Icon className="arrow-left" />
								<div className="text">Return</div>
							</React.Fragment>
						)}
					/>
				</div>
				<section className="frozen-form-wrap">
					<h1 className="page-title">freeze funds</h1>

					<div className="form">

						<div className="line">
							<div className="line-label">
								<span className="line-label-text">Amount, ECHO</span>
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
								<span className="line-label-text">Period</span>
							</div>

							<div className="line-content">
								<Dropdown className="white select-period">
									<Dropdown.Toggle variant="Info">
										<span className="dropdown-toggle-text">
											Select period
										</span>
										<span className="carret" />
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<PerfectScrollbar>
											<Dropdown.Item>
												3 months
											</Dropdown.Item>
											<Dropdown.Item>
												6 months
											</Dropdown.Item>
											<Dropdown.Item>
												12 months
											</Dropdown.Item>
										</PerfectScrollbar>
									</Dropdown.Menu>
								</Dropdown>
							</div>
							<div className="line">
								<div className="line-label">
									<span className="line-label-text">Coefficient
										<Popup
											content="This is the coefficient that will be used to calculate the reward for participating in blocks creation."
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
								<span className="line-label-text">Transaction Fee, ECHO</span>
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
								<span className="line-label-text">From</span>
							</div>
							<div className="line-content">
								<Dropdown className="white select-account">
									<Dropdown.Toggle variant="Info">
										<Avatar accountName="test" />
										<span className="dropdown-toggle-text">
											AccountName
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
							<div className="text">Freeze funds</div>
						)}
						onClick={() => this.onApply()}
					/>
					<Button
						className="btn-gray round"
						content={(
							<div className="text">Cancel</div>
						)}
						onClick={() => this.onCancel()}
					/>
				</section>
			</div>
		);
	}

}

export default FrozenFundsForm;
