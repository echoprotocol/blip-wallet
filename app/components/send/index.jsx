import React from 'react';
// import PropTypes from 'prop-types';
import { Input, Button } from 'semantic-ui-react';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import Avatar from '../avatar';
import InputDropdown from '../input-dropdown';

class Send extends React.Component {


	render() {

		return (
			<div className="send page">
				<PerfectScrollbar className="page-in-scroll">
					<div className="page-in-wrap">
						<div className="title">SEND TRANSACTION</div>
						<div className="form-wrap">
							<div className="line">

								<div className="line-label">
									<span className="line-label-text">From</span>
								</div>

								<div className="line-content">
									<Dropdown className="white select-account">
										<Dropdown.Toggle variant="Info">
											<Avatar accountName="Homerthegreat43" />
											<span className="dropdown-toggle-text">
												Homerthegreat43
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
							<div className="line">

								<div className="line-label">
									<span className="line-label-text">To</span>
								</div>

								<div className="line-content">
									<div className="field">
										<Input
											className={classnames('white', { success: false })}
											placeholder="Receiver"
											error={false}
											loading={false}
											fluid
										/>
										{
											false
											&& (
												<div className="error-message">
													error-message
												</div>
											)
										}
									</div>
								</div>
							</div>
							<div className="line">

								<div className="line-label">
									<span className="line-label-text">Amount</span>
								</div>

								<div className="line-content">
									<InputDropdown
										title="Amount"
										hints={['Minimal amount is 0.00005 ZSHC']}
									/>
								</div>
							</div>
							<div className="line">

								<div className="line-label">
									<span className="line-label-text">Fee</span>
								</div>

								<div className="line-content">
									<InputDropdown
										title="Fee"
										hints={['Generated automatically based on amount and note length']}
									/>
								</div>
							</div>

						</div>
						<div className="page-in-action">
							<Button
								className="btn-primary white"
								content={(
									<div className="text">
										Send transaction
									</div>
								)}
							/>
						</div>
					</div>
				</PerfectScrollbar>
			</div>
		);
	}

}

// Send.propTypes = {
// };

export default Send;
