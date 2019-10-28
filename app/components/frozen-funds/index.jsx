import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { Button } from 'semantic-ui-react';
import FrozenForm from './form';
import settings from '../../assets/images/settings.svg';

class FrozenFunds extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showSettings: false,
		};
	}

	toggleSettings(e) {
		e.target.blur();
		const { showSettings } = this.state;
		this.setState({
			showSettings: !showSettings,
		});
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
						<div className="frozen-wrap">
							<FrozenForm />

						</div>
					</PerfectScrollbar>
					<div className="settings-wrap">
						{
							showSettings ? (
								<Button className="btn-close" onClick={(e) => this.toggleSettings(e)} />
							) : (
								<Button
									className="btn-settings"
									onClick={(e) => { this.toggleSettings(e); }}
									content={
										<img src={settings} alt="" />
									}
								/>
							)
						}
					</div>
					{/* <Settings
						open={showSettings}
						toggleSettings={(e) => this.toggleSettings(e)}
						accounts={accounts}
						saveSelectedAccounts={saveAccounts}
						updateBalance={updBalance}
						assets={this.getAssets(balances) || []}
						hiddenAssets={hiddenAssets}
						changeVisibilityAsset={(e, id) => this.changeVisibilityAsset(e, id)}
						tokens={stateTokens}
					/> */}
				</div>
			</div>
		);
	}

}


export default FrozenFunds;
