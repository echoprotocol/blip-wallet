import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import MultiDropdown from '../multi-dropdown';
import AccountsMultiDropdown from '../accounts-multi-dropdown';
import TransactionsMultiDropdown from '../transition-multi-dropdown';


import { ASSET_TYPE } from '../../constants/transaction-constants';

class Filter extends React.Component {

	onToggleChecked(e, type, key) {
		e.preventDefault();
		this.props.toggleChecked(type, key);
	}


	renderCoin(coin, key) {
		return (
			<div className="account" key={key}>
				<div className="checkbox transparent">
					<input type="checkbox" checked={coin.get('selected')} onChange={() => {}} />
					<label htmlFor="checkbox" className="checkbox-label" onClick={(e) => this.onToggleChecked(e, 'coins', key)}>
						<span className="label-account-name">
							{coin.get('type') === ASSET_TYPE ? coin.get('asset') : coin.getIn(['contract', 'token', 'symbol'])}
						</span>
					</label>
				</div>
			</div>
		);
	}

	renderOperation(operation, key) {
		return (
			<div className="account" key={key}>
				<div className="checkbox transparent">
					<input type="checkbox" checked={operation.get('selected')} onChange={() => {}} />
					<label htmlFor="checkbox" className="checkbox-label" onClick={(e) => this.onToggleChecked(e, 'types', key)}>
						<span className="label-account-name">{operation.get('type')}</span>
					</label>
				</div>
			</div>
		);
	}

	renderAccount(account, key) {
		return (
			<div className="account" key={key}>
				<div className="checkbox transparent">
					<input type="checkbox" checked={account.get('selected')} onChange={() => {}} />
					<label htmlFor="checkbox" className="checkbox-label" onClick={(e) => this.onToggleChecked(e, 'accounts', key)}>
						<span className="label-account-name">{account.get('name')}</span>
					</label>
				</div>
			</div>
		);
	}

	render() {
		// const { filter } = this.props;

		return (
			<div className="sidebar-settings filter">
				<div className="head">
					<Button className="btn-inversed">
						<span className="text">Set to default</span>
					</Button>
					<Button className="btn-close" />
				</div>
				<div className="body">
					<div className="field">
						<AccountsMultiDropdown label="Accounts" />
					</div>
					<div className="field">
						<TransactionsMultiDropdown label="Transaction type" />
					</div>
					<div className="field">
						<MultiDropdown label="Asset" />
					</div>
					{/*
						{filter.get('coins') && filter.get('coins').map((coin, i) => this.renderCoin(coin, i))}
						{filter.get('types') && filter.get('types').map((type, i) => this.renderOperation(type, i))}
						{filter.get('accounts') && filter.get('accounts').map((account, i) => this.renderAccount(account, i))}
					*/}
				</div>
				<div className="footer">
					<Button className="btn-primary">
						<span className="text">Apply & close</span>
					</Button>
				</div>
			</div>
		);
	}

}

Filter.propTypes = {
	// filter: PropTypes.object.isRequired,
	toggleChecked: PropTypes.func.isRequired,
};

export default Filter;
