import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import dimmerLoading from '../../assets/images/dimmer-loader.png';

class BlipDimmer extends React.Component {

	render() {
		const { content, intl } = this.props;

		const contentTranslate = intl.formatMessage({ id: content });

		return (
			<div className="dimmer">
				<img className="dimmer-loading" src={dimmerLoading} alt="" />
				{ content
					&& (
						<div className="dimmer-content">
							{contentTranslate}
						</div>
					)
				}

			</div>
		);
	}

}

BlipDimmer.propTypes = {
	content: PropTypes.string,
	intl: intlShape.isRequired,
};

BlipDimmer.defaultProps = {
	content: '',
};

export default injectIntl(BlipDimmer);
