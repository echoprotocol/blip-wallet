import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Button } from 'semantic-ui-react';

import Networks from './networks';

class Settings extends React.Component {

	render() {
		return (
			<div className="page settings">
				<PerfectScrollbar className="page-in-scroll">
					<div className="page-in-wrap">
						<div className="form-wrap">
							<div className="title">Network</div>

							<div className="line">
								<div className="line-content">
									<div className="line-vertical-label">
										<span className="line-vertical-label-text">Select Network</span>
									</div>
									<Networks
										connected={false}
										networks={this.props.networks}
										changeNetwork={this.props.changeNetwork}
									/>
								</div>
							</div>
							<div className="line">
								<div className="line-content">
									<div className="line-vertical-label">
										<span className="line-vertical-label-text">Node address</span>
									</div>
									<div className="line-link">
										wss://devnet-homer-io.net/ws
									</div>
								</div>
							</div>

						</div>
						<div className="page-in-action">
							<div className="btn-wrap">
								<Button
									className="btn-primary white"
									content={(
										<div className="text">
										Apply changes
										</div>
									)}
									disabled={false}
								/>
								<Button
									className="btn-gray round"
									content={(
										<div className="text">
										Cancel
										</div>
									)}
									disabled={false}
								/>
							</div>
						</div>
					</div>
				</PerfectScrollbar>
			</div>

		);
	}

}

Settings.propTypes = {
	networks: PropTypes.object.isRequired,
	changeNetwork: PropTypes.func.isRequired,
};

// Settings.defaultProps = {};

export default Settings;
