import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { NETWORK_STATUS, REMOTE_NODE } from '../../constants/global-constants';
import FormatHelper from '../../helpers/format-helper';
import Services from '../../services';

class Networks extends React.Component {

	onClick(value) {
		const { networks } = this.props;

		const current = networks.find((n) => n.get('active'));

		if (current && current.equals(value)) {
			value = null;
		}

		this.props.changeNetwork(value);
	}

	render() {
		const {
			network, networks, connected, node, isDisabled,
		} = this.props;
		const current = network || networks.find((n) => n.get('active'));
		const status = connected ? NETWORK_STATUS.ONLINE : NETWORK_STATUS.OFFLINE;

		return (
			<div className="form-wrap">
				<div className="lines">
					<div className="line">
						<div className="line-label">
							<span className="line-label-text"><FormattedMessage id="settings.networks.select.network" /></span>
						</div>
						<div className="line-content">
							<Dropdown className="white networks">
								<Dropdown.Toggle variant="Info" disabled={isDisabled}>
									<span className="dropdown-toggle-text">
										{
											!network ? (
												<div className={classnames('connected-status', status)}>
													<div className="connected-popover">
														<FormattedMessage id={`settings.networks.status.${status}`} />
													</div>
												</div>
											) : (<div className="connected-status" />)
										}
										{FormatHelper.capitalizeFirstLetter(current.get('id'))}
									</span>
									<span className="carret" />
								</Dropdown.Toggle>

								<Dropdown.Menu>
									<PerfectScrollbar>
										{
											networks.map((value) => (
												(value.get('id')) === (current.get('id'))
													? (
														<Dropdown.Item className="selected-item" key={value.get('id')} eventKey={value.get('id')} onClick={(() => this.onClick(value))}>
															{FormatHelper.capitalizeFirstLetter(value.get('id'))}
														</Dropdown.Item>
													) : (
														<Dropdown.Item key={value.get('id')} eventKey={value.get('id')} onClick={(() => this.onClick(value))}>
															{FormatHelper.capitalizeFirstLetter(value.get('id'))}
														</Dropdown.Item>
													)
											))
										}
									</PerfectScrollbar>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</div>
					<div className="line">
						<div className="line-label">
							<span className="line-label-text"><FormattedMessage id="settings.networks.node.address" /></span>
						</div>
						<div className="line-content">
							<a className="line-link" href={node === REMOTE_NODE ? current.getIn(['remote', 'url']) : Services.getEcho().localNodeUrl}>
								{
									node === REMOTE_NODE ? current.getIn(['remote', 'url']) : Services.getEcho().localNodeUrl
								}
							</a>
						</div>
					</div>
				</div>

			</div>
		);
	}

}

Networks.propTypes = {
	network: PropTypes.object,
	connected: PropTypes.bool,
	isDisabled: PropTypes.bool,
	node: PropTypes.string.isRequired,
	networks: PropTypes.object.isRequired,
	changeNetwork: PropTypes.func.isRequired,
};

Networks.defaultProps = {
	connected: false,
	isDisabled: false,
	network: null,
};

export default Networks;
