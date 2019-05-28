import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';

class Networks extends React.Component {

	render() {
		const { networks, connected } = this.props;
		const current = networks.find((n) => n.get('active'));

		return (
			<Dropdown className="white networks">
				<Dropdown.Toggle variant="Info">
					<span

						className="dropdown-toggle-text"
					>
						<div className={classnames('connected-status', { connected })}>
							<div className="connected-popover">
								Status: { connected ? 'online' : 'offline' }
							</div>
						</div>
						{current.get('id')}
					</span>
					<span className="carret" />
				</Dropdown.Toggle>

				<Dropdown.Menu>
					<PerfectScrollbar>
						{
							networks.map((network) => (
								<Dropdown.Item
									key={network.get('id')}
									eventKey={network.get('id')}
									onClick={(() => this.props.changeNetwork(network))}
								>
									{network.get('id')}
								</Dropdown.Item>
							))
						}
					</PerfectScrollbar>
				</Dropdown.Menu>
			</Dropdown>
		);
	}

}

Networks.propTypes = {
	networks: PropTypes.object.isRequired,
	changeNetwork: PropTypes.func.isRequired,
	connected: PropTypes.bool,
};

Networks.defaultProps = {
	connected: false,
};

export default Networks;
