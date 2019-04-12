import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import classnames from 'classnames';
import avatar from '../../assets/images/default-avatar.svg';

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
		const { open } = this.props;
		return (
			<React.Fragment>
				<div className="segment tab accounts-filter">
					<div className="info-text">
						If you have more than one account, your accounts balances will be displayed together.
						You can filter your balances by account:
					</div>
					<div className="select-accounts">
						<div className="title">Select accounts</div>
						<div className="accounts-list">
							<div className="account">
								<div className="checkbox transparent">
									<input
										disabled={!open}
										type="checkbox"
										id="acc0"
									/>
									<label htmlFor="acc0" className="checkbox-label">
										<img alt="" src={avatar} className="label-avatar" />
										<span className="label-account-name"> Homersimpson</span>
									</label>
								</div>
							</div>
							<div className="account">
								<div className="checkbox transparent">
									<input
										disabled={!open}
										type="checkbox"
										id="acc1"
									/>
									<label htmlFor="acc1" className="checkbox-label">
										<img alt="" src={avatar} className="label-avatar" />
										<span className="label-account-name"> Homersimpson</span>
									</label>
								</div>
							</div>
						</div>
					</div>

				</div>
				<div className="segment action">
					<Button
						className="btn-primary"
						disabled={!open}
						content={
							<span className="text">Save changes</span>
						}
					/>
				</div>
			</React.Fragment>
		);
	}

	renderArchivedAssets() {
		const { open } = this.props;
		return (
			<React.Fragment>
				<div className="segment tab archive-assets">
					<div className="info-text">
					You can hide/show assets if you are bored watching them.
					Echo is a proto-asset (Alpha and Omega. The beggining and the end).
					You can’t hide it. Haha
					</div>
					<div className="archive-table">
						<div className="line">
							<div className="coin">Echo</div>
							<div className="checkbox-toggle">
								<input type="checkbox" name="" id="" />
							</div>
							<div className="balance">0.00000000</div>
						</div>
					</div>

				</div>
				<div className="segment action">
					<Button
						className="btn-primary"
						disabled={!open}
						content={
							<span className="text">Save changes</span>
						}
					/>
				</div>
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
};

export default Settings;
