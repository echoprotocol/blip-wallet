import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Dropdown } from 'react-bootstrap';
import classnames from 'classnames';
import { fromJS } from 'immutable';

import Avatar from '../avatar';
import { MODAL_BACKUP, MODAL_LOGOUT } from '../../constants/modal-constants';
import { ECHO_ASSET_PRECISION } from '../../constants/global-constants';
import FormatHelper from '../../helpers/format-helper';
import { AUTHORIZATION } from '../../constants/routes-constants';

class ManageAccounts extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showSettings: false,
		};
		this.onChangePrimaryAccount = this.onChangePrimaryAccount.bind(this);
	}

	componentDidUpdate(prevProps) {
		const { updateBalance, histories } = this.props;

		if (!histories.equals(prevProps.histories)) {
			updateBalance();
		}
	}

	onChangePrimaryAccount(indexAccount) {
		const { changePrimaryAccount } = this.props;
		changePrimaryAccount(indexAccount);
	}

	onOpenModal(modal, data) {
		this.props.openModal(modal, fromJS(data));
	}

	renderAccounts() {
		const { accounts, balances } = this.props;

		return [...accounts.map((account, index) => {
			const amount = FormatHelper.getBalance(index, balances);
			const customAssetsCount = FormatHelper.getCustomAssetsCount(index, balances);
			const precision = ![...balances.values()][0] ? ECHO_ASSET_PRECISION : [...balances.values()][0].asset.get('precision');

			return (
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
								: (
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
									<Dropdown.Item onClick={() => this.onOpenModal(MODAL_BACKUP, { accountId: index })} eventKey={1}>
										Backup info
									</Dropdown.Item>
									<Dropdown.Item onClick={() => this.onOpenModal(MODAL_LOGOUT, { accountName: account.get('name'), accountId: index })} eventKey={3}>
										Logout
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</div>
					<div className="currency-wrap">
						<div className="currency">Echo</div>
						{customAssetsCount ? <div className="bonus">{`+ ${customAssetsCount} assets`}</div> : ''}
					</div>
					<div className="line">
						<div className="balance">
							<span className="integer">{`${amount.split('.')[0]}`}</span>
							<span className="fractional">{FormatHelper.getFraction(amount, precision)}</span>
						</div>
					</div>
				</div>
			);
		}).values()];
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
									onClick={() => this.props.history.push(AUTHORIZATION)}
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
										onClick={() => this.onOpenModal(MODAL_LOGOUT, { all: true })}
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
	balances: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	changePrimaryAccount: PropTypes.func.isRequired,
	updateBalance: PropTypes.func.isRequired,
	histories: PropTypes.object.isRequired,
};

export default ManageAccounts;
