import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Animated } from 'react-animated-css';
import PerfectScrollbar from 'react-perfect-scrollbar';

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
		const { filter } = this.props;

		return (
			<div className="wallet-settings">
				<div className="settings-tabs">
					<PerfectScrollbar className="segment tab accounts-filter">
						<Animated isVisible animationIn="fadeIn">
							<div className="select-accounts">
								<div className="title">ASSETS/TOKENS</div>
								<div className="accounts-list">
									{filter.get('coins') && filter.get('coins').map((coin, i) => this.renderCoin(coin, i))}
								</div>
							</div>
							<div className="select-accounts">
								<div className="title">OPERATION TYPES</div>
								<div className="accounts-list">
									{filter.get('types') && filter.get('types').map((type, i) => this.renderOperation(type, i))}
								</div>
							</div>
							<div className="select-accounts">
								<div className="title">ACCOUNTS</div>
								<div className="accounts-list">
									{filter.get('accounts') && filter.get('accounts').map((account, i) => this.renderAccount(account, i))}
								</div>
							</div>
						</Animated>
					</PerfectScrollbar>
					<Animated isVisible animationIn="fadeIn" className="segment action">
						<Button className="btn-primary">
							<span className="text">Reset filters</span>
						</Button>
					</Animated>
				</div>
			</div>
		);
	}

}

Filter.propTypes = {
	filter: PropTypes.object.isRequired,
	toggleChecked: PropTypes.func.isRequired,
};

export default Filter;
