import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import { SEND } from '../../constants/routes-constants';
import FormatHelper from '../../helpers/format-helper';

class Footer extends React.Component {

	render() {
		const { currentNode } = this.props;

		return (
			<React.Fragment>
				<div className="footer-actions">
					<div className="btn-wrap btns-2">
						<Button
							className="btn-main"
							content={
								<span className="text"><FormattedMessage id="wallet.send" /></span>
							}
							onClick={() => this.props.history.push(SEND)}
						/>
						{/*
							<Button
								className="btn-gray"
								content={
								<span className="text"><FormattedMessage id="wallet.receive" /></span>
							}
							/>
						*/}
					</div>
					<div className="footer-info">
						<div className="mode"><FormattedMessage id={`wallet.${FormatHelper.capitalizeFirstLetter(currentNode)} node`} /></div>
						{/* <div className="sync"> */}
						{/*	Syncing with network: */}
						{/*	<span className="percent">100%</span> */}
						{/* </div> */}
					</div>
				</div>
				<div className="loading-status" />
			</React.Fragment>
		);
	}

}

Footer.propTypes = {
	history: PropTypes.object.isRequired,
	currentNode: PropTypes.string.isRequired,
};

export default Footer;
