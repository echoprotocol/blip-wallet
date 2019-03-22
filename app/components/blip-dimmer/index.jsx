import React from 'react';
import PropTypes from 'prop-types';

import dimmerLoading from '../../assets/images/dimmer-loader.png';

class BlipDimmer extends React.Component {

	render() {
		const { content } = this.props;
		return (
			<div className="dimmer">
				<img className="dimmer-loading" src={dimmerLoading} alt="" />
				{ content
					&& (
						<div className="dimmer-content">
							{content}
						</div>
					)
				}

			</div>
		);
	}

}

BlipDimmer.propTypes = {
	content: PropTypes.string,
};

BlipDimmer.defaultProps = {
	content: '',
};

export default BlipDimmer;
