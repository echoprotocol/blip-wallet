import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { Animated } from 'react-animated-css';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Avatar from '../avatar';

class Settings extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			selectedAccounts: [],
		};
	}

	componentDidMount() {
		const { accounts, updateBalance } = this.props;
		const selectedAccounts = [];
		accounts.forEach((account, id) => {
			if (account.get('selected')) {
				selectedAccounts.push(id);
			}
		});

		this.setState({ selectedAccounts });

		updateBalance();
	}


	onSelect(value) {
		let { selectedAccounts } = this.state;

		if (selectedAccounts.includes(value)) {
			selectedAccounts = selectedAccounts.filter((acc) => acc !== value);
		} else {
			selectedAccounts.push(value);
		}

		this.setState({ selectedAccounts });
	}

	onSave(e) {
		const { saveSelectedAccounts, toggleSettings } = this.props;
		const { selectedAccounts } = this.state;

		toggleSettings(e);

		saveSelectedAccounts(selectedAccounts);
	}

	setActiveTab(e, active) {
		e.stopPropagation();
		this.setState({
			activeIndex: active,
		});

	}

	renderMenu() {
		const { activeIndex } = this.state;
		const { open } = this.props;

		const menuItems = [
			{
				menuItem:
	<Button
		key="0"
		disabled={!activeIndex || !open}
		className={
			classnames(
				'menu-item',
				{ active: !activeIndex },
			)
		}
		onClick={(e) => this.setActiveTab(e, 0)}
	> Filter by accounts
	</Button>,
			},
			{
				menuItem:
	<Button
		key="1"
		disabled={!!activeIndex || !open}
		className={
			classnames(
				'menu-item',
				{ active: !!activeIndex },
			)
		}
		onClick={(e) => this.setActiveTab(e, 1)}
	>Archived assets
	</Button>,
			},
		];

		return (
			menuItems.map((item) => (
				item.menuItem
			)));
	}

	renderAccounts() {
		const { accounts, open } = this.props;
		const { selectedAccounts } = this.state;

		const result = [];

		accounts.forEach((account, index) => {
			const key = index;
			result.push(
				<div className="account" key={key}>
					<div className="checkbox transparent">
						<input
							disabled={!open}
							checked={selectedAccounts.includes(index)}
							type="checkbox"
							id={index}
							onChange={() => {}}
						/>
						<label htmlFor={index} className="checkbox-label" onClick={() => this.onSelect(index)}>
							<Avatar accountName={account.get('name')} round />
							<span className="label-account-name">{account.get('name')}</span>
						</label>
					</div>
				</div>,
			);
		});

		return result;
	}

	renderFilterByAccounts() {
		const { open } = this.props;
		const { activeIndex } = this.state;

		return (
			<React.Fragment>
				<PerfectScrollbar className="segment tab accounts-filter">
					<Animated
						isVisible={!activeIndex}
						animationIn="fadeIn"
					>
						<div className="info-text">
								If you have more than one account, your accounts balances will be displayed together.
								You can filter your balances by account:
						</div>
						<div className="select-accounts">
							<div className="title">Select accounts</div>
							<div className="accounts-list">
								{this.renderAccounts()}
							</div>
						</div>
					</Animated>
				</PerfectScrollbar>
				<Animated
					isVisible={!activeIndex}
					animationIn="fadeIn"
					className="segment action"
				>
					<Button
						className="btn-primary"
						disabled={!open}
						onClick={(e) => this.onSave(e)}
						content={
							<span className="text">Save changes</span>
						}
					/>
				</Animated>
			</React.Fragment>
		);
	}

	renderArchivedAssets() {
		const { open } = this.props;
		const { activeIndex } = this.state;
		return (
			<React.Fragment>
				<Animated
					animationIn="fadeIn"
					isVisible={!!activeIndex}
					className="segment tab archive-assets"
				>
					<div className="info-text">
					You can hide/show assets if you are bored watching them.
					Echo is a proto-asset (Alpha and Omega. The beggining and the end).
					You can’t hide it. Haha
					</div>
					<div className="archive-table">
						<div className="line">
							<div className="col">
								<div className="line sub">
									<div className="coin">ZHCN</div>
									<div className="balance">34234</div>
								</div>
								<div className="line sub">
									<div className="type">erc20 token</div>
								</div>
							</div>
							<div className="col">
								<Button
									className="btn-inversed"
									content="Unarchive"
								/>
							</div>
						</div>
						<div className="line">
							<div className="col">
								<div className="line sub">
									<div className="coin">Echo</div>
									<div className="balance">23489238794.003234523445234452344523445234234234</div>
								</div>
								<div className="line sub">
									<div className="type">asset</div>
								</div>
							</div>
							<div className="col">
								<Button
									disabled={!open}
									className="btn-inversed"
									content="Unarchive"
								/>
							</div>
						</div>

					</div>

				</Animated>

			</React.Fragment>
		);
	}

	render() {
		const { activeIndex } = this.state;

		return (
			<div className="wallet-settings">
				<div className="settings-tabs">
					<div className="menu">
						{
							this.renderMenu()
						}
					</div>
					{
						!activeIndex ? this.renderFilterByAccounts() : this.renderArchivedAssets()
					}
				</div>

			</div>
		);
	}

}

Settings.propTypes = {
	open: PropTypes.bool.isRequired,
	accounts: PropTypes.object.isRequired,
	saveSelectedAccounts: PropTypes.func.isRequired,
	updateBalance: PropTypes.func.isRequired,
	toggleSettings: PropTypes.func.isRequired,
};

export default Settings;
