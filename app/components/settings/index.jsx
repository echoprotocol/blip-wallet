import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import Networks from './networks';

class Settings extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			network: null,
		};
	}

	onChange(field, value) {
		this.setState({ [field]: value });
	}

	onApply() {
		const { network } = this.state;

		this.props.applySettings({
			network,
		});
	}

	onCancel() {
		this.clearState();
	}

	clearState() {
		this.setState({
			network: null,
		});
	}

	render() {
		const { network } = this.state;
		const { loading } = this.props;

		return (
			<div className="page-wrap">
				<div className="page">
					<PerfectScrollbar className="page-scroll">
						<div className="settings-page-wrap">
							<div className="title">
								<FormattedMessage id="settings.networks.title" />
							</div>
							<Networks
								network={network}
								connected={this.props.isConnected}
								node={this.props.currentNode}
								networks={this.props.networks}
								changeNetwork={(value) => this.onChange('network', value)}
								isDisabled={loading}
							/>
						</div>

					</PerfectScrollbar>
					<div className="page-in-action">
						<div className="btn-wrap">
							<Button
								className="btn-primary white"
								content={(
									<div className="text"><FormattedMessage id="settings.apply" /></div>
								)}
								disabled={loading || !network}
								onClick={() => this.onApply()}
							/>
							<Button
								className="btn-gray round"
								content={(
									<div className="text"><FormattedMessage id="settings.cancel" /></div>
								)}
								disabled={loading || !network}
								onClick={() => this.onCancel()}
							/>
						</div>
					</div>
				</div>
			</div>

		);
	}

}

Settings.propTypes = {
	isConnected: PropTypes.bool,
	loading: PropTypes.bool,
	currentNode: PropTypes.string.isRequired,
	networks: PropTypes.object.isRequired,
	applySettings: PropTypes.func.isRequired,
};

Settings.defaultProps = {
	isConnected: false,
	loading: false,
};

export default Settings;
