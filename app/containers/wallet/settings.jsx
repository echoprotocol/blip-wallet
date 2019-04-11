import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import classnames from 'classnames';


class Settings extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
		};
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

	renderFilterByAccounts() {
		return (
			<div className="info-text">
				If you have more than one account, your accounts balances will be displayed together.
				You can filter your balances by account:
			</div>
		);
	}

	renderArchivedAssets() {
		return (
			'hoho'
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
					<div className="segment tab">
						{
							!activeIndex ? this.renderFilterByAccounts() : this.renderArchivedAssets()
						}
					</div>
				</div>

			</div>
		);
	}

}

Settings.propTypes = {
	open: PropTypes.bool.isRequired,
};

export default Settings;
