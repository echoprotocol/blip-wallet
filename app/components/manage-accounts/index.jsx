import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Dropdown } from 'react-bootstrap';
import classnames from 'classnames';
import Avatar from '../avatar';
import { MODAL_BACKUP, MODAL_LOGOUT } from '../../constants/modal-constants';
import { ECHO_ASSET_ID } from '../../constants/global-constants';
import FormatHelper from '../../helpers/format-helper';

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

	getFraction(balance) {
		if (balance) {
			if (balance.split('.')[1]) {
				return `.${balance.split('.')[1]}`;
			}
		}

		return '';
	}

	getBalance(accountId) {
		const { balances } = this.props;

		const coreBalance = balances.find((b) => b.asset.get('id') === ECHO_ASSET_ID && b.owner === accountId);

		if (!coreBalance) {
			return false;
		}

		return FormatHelper.formatAmount(coreBalance.amount, coreBalance.asset.get('precision'));
	}

	getCustomAssetsCount(accountId) {
		const { balances } = this.props;

		return balances.filter((b) => b.asset.get('id') !== ECHO_ASSET_ID && b.owner === accountId).size;
	}

	renderAccounts() {
		const { accounts } = this.props;

		return [...accounts.map((account, index) => {
			const amount = this.getBalance(index);
			const customAssetsCount = this.getCustomAssetsCount(index);

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
									<Dropdown.Item onClick={() => this.props.openModal(MODAL_LOGOUT, { accountName: account.get('name'), accountId: index })} eventKey={3}>
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
							<span className="integer">{amount ? `${amount.split('.')[0]}` : '0'}</span>
							<span className="fractional">{this.getFraction(amount)}</span>
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
										onClick={() => this.props.removeAllAccounts()}
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
	removeAllAccounts: PropTypes.func.isRequired,
	accounts: PropTypes.object.isRequired,
	balances: PropTypes.object.isRequired,
	changePrimaryAccount: PropTypes.func.isRequired,
};

export default ManageAccounts;
