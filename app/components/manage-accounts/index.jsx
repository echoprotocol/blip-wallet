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
		this.onChangePrimaryAccount = this.onChangePrimaryAccount.bind(this);
	}

	onChangePrimaryAccount(indexAccount) {
		const { changePrimaryAccount } = this.props;
		changePrimaryAccount(indexAccount);
	}


	renderAccounts() {
		const { accounts } = this.props;

		return [...accounts.map((account, index) => (
			<div className="account-item" key={account.get('name')}>
				<div className="account-info">
					<div className="avatar">
						<Avatar accountName={account.get('name')} />
					</div>
					<div className={
						classnames(
							'name-wrap',
							{ primary: account.get('primary') },
						)
					}
					>
						{account.get('primary')
							? (
								<React.Fragment>
									<div className="name">{account.get('name')}</div>
									<div className="name-label">Primary account</div>
								</React.Fragment>
							)
							:							(
								<React.Fragment>
									<div className="name-label">Account name</div>
									<div className="name">{account.get('name')}</div>
								</React.Fragment>
							)
						}
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
									<Avatar accountName={account.get('name')} />
								</div>
								<div className="account-name">{account.get('name')}</div>
								<Dropdown.Item onClick={() => this.onChangePrimaryAccount(index)} eventKey={0}>
                                    Set as primary
								</Dropdown.Item>
								<Dropdown.Item onClick={() => this.props.openModal(MODAL_BACKUP, { accountId: index })} eventKey={1}>
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
					{account.get('primary') ? <div className="bonus">+ 0 assets</div> : null}
				</div>
				<div className="line">
					<div className="balance">
						<span className="integer" />
						<span className="fractional" />
					</div>
				</div>
			</div>
		)).values()];
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
								{this.renderAccounts()}
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
	accounts: PropTypes.object.isRequired,
	changePrimaryAccount: PropTypes.func.isRequired,
};

export default ManageAccounts;
