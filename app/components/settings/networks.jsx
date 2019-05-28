import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

class Networks extends React.Component {

	render() {
		const { networks } = this.props;
		const current = networks.find((n) => n.get('active'));

		return (
			<Dropdown className="white select-account">
				<Dropdown.Toggle variant="Info">
					<span className="dropdown-toggle-text">
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
};

// Networks.defaultProps = {};

export default Networks;
