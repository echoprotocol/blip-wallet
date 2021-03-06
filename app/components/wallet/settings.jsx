import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { Animated } from 'react-animated-css';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Avatar from '../avatar';
import { TOKEN_TYPE } from '../../constants/graphql-constants';
import FormatHelper from '../../helpers/format-helper';

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

	onClose(e) {
		const { toggleSettings } = this.props;

		toggleSettings(e);
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
		onMouseDown={(e) => this.setActiveTab(e, 0)}
	> <FormattedMessage id="wallet.filtert" />
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
		onMouseDown={(e) => this.setActiveTab(e, 1)}
	><FormattedMessage id="wallet.archivedt" />
	</Button>,
			},
		];

		return (
			menuItems.map((item) => (
				item.menuItem
			)));
	}

	renderAccounts() {
		const { open, accounts } = this.props;
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
						{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
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
							<FormattedMessage id="wallet.filter" />
						</div>
						<div className="select-accounts">
							<div className="title"><FormattedMessage id="wallet.select" /></div>
							<div className="select-accounts-list">
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
							<span className="text"><FormattedMessage id="wallet.save" /></span>
						}
					/>
				</Animated>
			</React.Fragment>
		);
	}

	renderHiddenAssets() {
		const { hiddenAssets, changeVisibilityAsset } = this.props;
		let { assets, tokens } = this.props;
		const { activeIndex } = this.state;

		if (!assets) {
			return null;
		}

		assets = assets.filter((asset) => hiddenAssets.has(asset.id));

		if (tokens) {
			tokens = tokens.filter((token) => hiddenAssets.has(token.getIn(['contract', 'id'])));

			const tokensArray = [];

			tokens.forEach((balance) => {
				if (
					balance.get('type') === TOKEN_TYPE
					&& !tokensArray.find((t) => balance.getIn(['contract', 'id']) === t.getIn(['contract', 'id']))
				) {
					tokensArray.push(balance);
				}
			});

			tokens = tokensArray.map((token, id) => {
				const key = `${id}token`;

				const amounts = tokens.reduce((arr, balance) => {
					if (balance.getIn(['contract', 'id']) === token.getIn(['contract', 'id'])) {
						arr.push(balance.get('amount'));
					}
					return arr;
				}, []);

				const amount = FormatHelper.accumulateBalances(amounts);

				const amountResult = FormatHelper.formatAmount(amount, parseInt(token.getIn(['contract', 'token', 'decimals']), 10));
				const precision = token.getIn(['contract', 'token', 'decimals']);

				return (
					<div className="line" key={key}>
						<div className="col">
							<div className="line sub">
								<div className="coin">{token.getIn(['contract', 'token', 'symbol'])}</div>
								<div className="balance">{amountResult}{FormatHelper.getFraction(amountResult, precision)}</div>
							</div>
							<div className="line sub">
								<div className="type">{`${token.getIn(['contract', 'type'])} token`}</div>
							</div>
						</div>
						<div className="col">
							<Button
								onClick={(e) => changeVisibilityAsset(e, token.getIn(['contract', 'id']))}
								className="btn-inversed"
								content="Unarchive"
							/>
						</div>
					</div>
				);
			});
		}

		return (
			<PerfectScrollbar className="archive-scroll">
				<Animated
					animationIn="fadeIn"
					isVisible={!!activeIndex}
					className="segment tab archive-assets"
				>
					<div className="info-text">
						<FormattedMessage id="wallet.archived" />
					</div>
					<div className="archive-table">
						{assets.map((asset, key) => (
							<div className="line" key={key.toString()}>
								<div className="col">
									<div className="line sub">
										<div className="coin">{asset.symbol}</div>
										<div className="balance">{asset.amount}{FormatHelper.getFraction(asset.amount, asset.precision)}</div>
									</div>
									<div className="line sub">
										<div className="type">asset</div>
									</div>
								</div>
								<div className="col">
									<Button
										onClick={(e) => changeVisibilityAsset(e, asset.id)}
										className="btn-inversed"
										content="Unarchive"
									/>
								</div>
							</div>
						)).concat(tokens)}
					</div>
				</Animated>
			</PerfectScrollbar>
		);
	}

	render() {
		const { activeIndex } = this.state;

		return (
			<div className="sidebar-settings">
				<div className="settings-tabs">
					<div className="menu">
						{
							this.renderMenu()
						}
					</div>
					{
						!activeIndex ? this.renderFilterByAccounts() : this.renderHiddenAssets()
					}
				</div>

			</div>
		);
	}

}

Settings.propTypes = {
	open: PropTypes.bool.isRequired,
	accounts: PropTypes.object.isRequired,
	assets: PropTypes.array.isRequired,
	tokens: PropTypes.any.isRequired,
	hiddenAssets: PropTypes.object.isRequired,
	saveSelectedAccounts: PropTypes.func.isRequired,
	updateBalance: PropTypes.func.isRequired,
	toggleSettings: PropTypes.func.isRequired,
	changeVisibilityAsset: PropTypes.func.isRequired,
};

export default Settings;
