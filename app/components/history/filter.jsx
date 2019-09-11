import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import MultiDropdown from '../multi-dropdown';
import AccountsMultiDropdown from '../accounts-multi-dropdown';
import TransactionsMultiDropdown from '../transition-multi-dropdown';

import { ASSET_TYPE, TOKEN_TYPE } from '../../constants/transaction-constants';

class Filter extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			accounts: null,
			coins: null,
			types: null,
			search: {
				account: {
					value: '',
					timeout: null,
				},
				type: {
					value: '',
					timeout: null,
				},
				coin: {
					value: '',
					timeout: null,
				},
			},
		};
	}

	componentDidMount() {
		this.updateFilters();
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.filter.equals(this.props.filter)) {
			this.updateFilters();
		}
	}

	componentWillUnmount() {
		this.clear();
	}

	onToggleChecked(type, item) {
		this.setState((prevState) => {
			const index = prevState[type].indexOf(item);
			const list = prevState[type].set(index, item.set('selected', !item.get('selected')));

			return { [type]: list };
		});
	}

	onSearch(type, value) {
		clearTimeout(this.state.search[type].timeout);

		const timeout = setTimeout(() => {
			this.setState((prevState) => ({
				search: {
					...prevState.search,
					[type]: {
						...prevState.search[type],
						value,
					},
				},
			}));
		}, 300);

		this.setState((prevState) => ({
			search: {
				...prevState.search,
				[type]: {
					...prevState.search[type],
					timeout,
				},
			},
		}));
	}

	onDropdownClose(type) {
		this.setState((prevState) => ({
			search: {
				...prevState.search,
				[type]: {
					value: '',
					timeout: null,
				},
			},
		}));
	}

	onReset(e) {
		e.preventDefault();

		let { accounts, coins, types } = this.state;

		accounts = accounts.map((i) => i.set('selected', true));
		coins = coins.map((i) => i.set('selected', true));
		types = types.map((i) => i.set('selected', true));

		this.setState({ accounts, coins, types });
		this.props.reset(accounts, coins, types);
	}

	onClose(e) {
		e.preventDefault();

		const { filter } = this.props;
		const { account, coin, type } = this.state.search;

		clearTimeout(account.timeout);
		clearTimeout(coin.timeout);
		clearTimeout(type.timeout);

		this.setState({
			accounts: filter.get('accounts'),
			coins: filter.get('coins'),
			types: filter.get('types'),
			search: {
				account: {
					value: '',
					timeout: null,
				},
				type: {
					value: '',
					timeout: null,
				},
				coin: {
					value: '',
					timeout: null,
				},
			},
		});

		this.props.close();
	}

	onApply(e) {
		e.preventDefault();

		const { accounts, coins, types } = this.state;
		this.props.apply(accounts, coins, types);
	}

	getInfo(type) {
		const list = this.state[type];

		if (!list) {
			return '';
		}

		const { intl } = this.props;
		const selected = list.filter((i) => i.get('selected'));

		if (list.size !== selected.size) {
			return intl.formatMessage({ id: `history.filter.${type}.selected` }, { size: selected.size });
		}

		return intl.formatMessage({ id: `history.filter.${type}.all` });
	}

	getAccountList(search, list) {
		if (!list || !search) {
			return list;
		}

		search = search.toLowerCase();

		return list.filter((i) => i.get('name').toLowerCase().includes(search));
	}

	getTypeList(search, list) {
		if (!list || !search) {
			return list;
		}

		const { intl } = this.props;
		search = search.toLowerCase();

		return list.filter((i) => intl.formatMessage({ id: i.get('name') }).toLowerCase().includes(search));
	}

	getCoinList(search, list) {
		if (!list) {
			return list;
		}

		if (search) {
			search = search.toLowerCase();

			list = list.filter((i) => {
				const symbol = i.get('type') === ASSET_TYPE ? i.getIn(['asset', 'symbol']) : i.getIn(['contract', 'token', 'symbol']);
				return symbol.toLowerCase().includes(search);
			});
		}

		return list.size ? [
			{
				id: 0,
				title: this.props.intl.formatMessage({ id: 'history.filter.coins.assets' }),
				list: list.filter((c) => c.get('type') === ASSET_TYPE),
			},
			{
				id: 1,
				title: this.props.intl.formatMessage({ id: 'history.filter.coins.tokens' }),
				list: list.filter((c) => c.get('type') === TOKEN_TYPE),
			},
		] : null;
	}

	getUpdatedList(prev, next) {
		if (!prev || !next) {
			return null;
		}

		const diff = next.filter((i) => !prev.includes(i));
		return prev.concat(diff);
	}

	updateFilters() {
		const { filter } = this.props;
		let { accounts, coins, types } = this.state;

		accounts = accounts || filter.get('accounts');
		coins = coins || filter.get('coins');
		types = types || filter.get('types');

		this.setState({
			accounts: this.getUpdatedList(accounts, filter.get('accounts')),
			coins: this.getUpdatedList(coins, filter.get('coins')),
			types: this.getUpdatedList(types, filter.get('types')),
		});
	}

	clear() {}

	render() {
		const {
			accounts, coins, types, search,
		} = this.state;

		const { intl } = this.props;

		return (
			<div className="sidebar-settings filter">
				<div className="head">
					<Button className="btn-inversed" onClick={(e) => this.onReset(e)}>
						<span className="text"><FormattedMessage id="history.filter.buttons.reset" /></span>
					</Button>
				</div>
				<div className="body">
					<div className="field">
						<AccountsMultiDropdown
							label={intl.formatMessage({ id: 'history.filter.accounts.label' })}
							info={this.getInfo('accounts')}
							placeholder={intl.formatMessage({ id: 'history.filter.accounts.placeholder' })}
							accounts={this.getAccountList(search.account.value, accounts)}
							toggle={(item) => this.onToggleChecked('accounts', item)}
							search={(value) => this.onSearch('account', value)}
							close={() => this.onDropdownClose('account')}
						/>
					</div>
					<div className="field">
						<TransactionsMultiDropdown
							label={intl.formatMessage({ id: 'history.filter.types.label' })}
							info={this.getInfo('types')}
							placeholder={intl.formatMessage({ id: 'history.filter.types.placeholder' })}
							types={this.getTypeList(search.type.value, types)}
							toggle={(item) => this.onToggleChecked('types', item)}
							search={(value) => this.onSearch('type', value)}
							close={() => this.onDropdownClose('type')}
						/>
					</div>
					<div className="field">
						<MultiDropdown
							label={intl.formatMessage({ id: 'history.filter.coins.label' })}
							info={this.getInfo('coins')}
							placeholder={intl.formatMessage({ id: 'history.filter.coins.placeholder' })}
							coins={this.getCoinList(search.coin.value, coins)}
							toggle={(value) => this.onToggleChecked('coins', value)}
							search={(value) => this.onSearch('coin', value)}
							close={() => this.onDropdownClose('coin')}
						/>
					</div>
				</div>
				<div className="footer">
					<Button className="btn-primary" onClick={(e) => this.onApply(e)}>
						<span className="text"><FormattedMessage id="history.filter.buttons.apply" /></span>
					</Button>
				</div>
			</div>
		);
	}

}

Filter.propTypes = {
	intl: intlShape.isRequired,
	filter: PropTypes.object.isRequired,
	close: PropTypes.func.isRequired,
	apply: PropTypes.func.isRequired,
	reset: PropTypes.func.isRequired,
};

export default injectIntl(Filter);
