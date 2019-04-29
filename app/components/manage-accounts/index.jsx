import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Dropdown } from 'react-bootstrap';
import classnames from 'classnames';
import Avatar from '../avatar';
import { MODAL_BACKUP, MODAL_LOGOUT } from '../../constants/modal-constants';

class ManageAccounts extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showSettings: false,
		};
	}

	render() {
		const { showSettings } = this.state;


		return (
			<div
				className={
					classnames(
						'page-wrap',
						{ open: showSettings },
					)
				}
			>
				<div className="page">
					<PerfectScrollbar className="page-scroll">
						<div className="manage-accounts-wrap">
							<div className="title-wrap">
								<div className="title">My accounts</div>
								<Button
									className="btn-link"
									content={
										<span>+ Add account</span>
									}
								/>
							</div>
							<div className="accounts-list">
								<div className="account-item">
									<div className="account-info">
										<div className="avatar">
											<Avatar accountName="Homerthegreat32" />
										</div>
										<div className="name-wrap primary">
											<div className="name">Homerthegreat32</div>
											<div className="name-label">Primary account</div>
										</div>
										<div className="settings">
											<Dropdown className="white select-account">
												<Dropdown.Toggle variant="info">
													<span className="dot" />
													<span className="dot" />
													<span className="dot" />
												</Dropdown.Toggle>

												<Dropdown.Menu>
													<div className="avatar-wrap">
														<Avatar accountName="Homerthegreat32" />
													</div>
													<div className="account-name">Homerthegreat32</div>
													<Dropdown.Item eventKey={0}>
														Set as primary
													</Dropdown.Item>
													<Dropdown.Item onClick={() => this.props.openModal(MODAL_BACKUP)} eventKey={1}>
														Backup info
													</Dropdown.Item>
													<Dropdown.Item onClick={() => this.props.openModal(MODAL_LOGOUT)} eventKey={3}>
														Logout
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
									</div>
									<div className="currency-wrap">
										<div className="currency">Echo</div>
										<div className="bonus">+ 3 assets</div>
									</div>
									<div className="line">
										<div className="balance">
											<span className="integer">10 012</span>
											<span className="fractional">.31235</span>
										</div>
									</div>
								</div>
								<div className="account-item">
									<div className="account-info">
										<div className="avatar">
											<Avatar accountName="Homerthegreat3" />
										</div>
										<div className="name-wrap">
											<div className="name-label">Account name</div>
											<div className="name">Homerthegreat3</div>
										</div>
										<div className="settings">
											<Dropdown className="white select-account">
												<Dropdown.Toggle variant="info">
													<span className="dot" />
													<span className="dot" />
													<span className="dot" />
												</Dropdown.Toggle>

												<Dropdown.Menu>
													<div className="avatar-wrap">
														<Avatar accountName="Homerthegreat3" />
													</div>
													<div className="account-name">Homerthegreat3</div>
													<Dropdown.Item eventKey={0}>
														Set as primary
													</Dropdown.Item>
													<Dropdown.Item eventKey={1}>
														Backup info
													</Dropdown.Item>
													<Dropdown.Item eventKey={3}>
														Logout
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
									</div>
									<div className="currency-wrap">
										<div className="currency">Echo</div>
									</div>
									<div className="line">
										<div className="balance">
											<span className="integer">10 012</span>
											<span className="fractional">.31235</span>
										</div>
									</div>
								</div>
								<div className="account-item">
									<div className="account-info">
										<div className="avatar">
											<Avatar accountName="Homerthegreat35" />
										</div>
										<div className="name-wrap">
											<div className="name-label">Account name</div>
											<div className="name">Homerthegreat35</div>
										</div>
										<div className="settings">
											<Dropdown className="white select-account">
												<Dropdown.Toggle variant="info">
													<span className="dot" />
													<span className="dot" />
													<span className="dot" />
												</Dropdown.Toggle>

												<Dropdown.Menu>
													<div className="avatar-wrap">
														<Avatar accountName="Homerthegreat35" />
													</div>
													<div className="account-name">Homerthegreat35</div>
													<Dropdown.Item eventKey={0}>
														Set as primary
													</Dropdown.Item>
													<Dropdown.Item eventKey={1}>
														Backup info
													</Dropdown.Item>
													<Dropdown.Item eventKey={3}>
														Logout
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
									</div>
									<div className="currency-wrap">
										<div className="currency">Echo</div>
									</div>
									<div className="line">
										<div className="balance">
											<span className="integer">10 012</span>
											<span className="fractional">.31235</span>
										</div>
									</div>
								</div>
							</div>
							<div className="actions">
								<div className="btn-wrap">
									<Button
										className="btn-link gray"
										content={
											<span>Remove all accounts</span>
										}
									/>
								</div>
							</div>
						</div>
					</PerfectScrollbar>

				</div>
			</div>
		);
	}

}

ManageAccounts.propTypes = {
	openModal: PropTypes.func.isRequired,
};

export default ManageAccounts;
