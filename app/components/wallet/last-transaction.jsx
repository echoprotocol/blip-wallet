/* eslint-disable react/jsx-no-target-blank */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import BN from 'bignumber.js';

import { EXPLORER_URL, ECHO_ASSET_PRECISION, ECHO_ASSET_SYMBOL } from '../../constants/global-constants';
import FormatHelper from '../../helpers/format-helper';
import Services from '../../services';

class LastTransaction extends React.Component {

	renderAmount(value = 0, precision = ECHO_ASSET_PRECISION) {
		return BN(value).div(BN(10).pow(precision)).toFixed(precision);
	}

	renderParticipant(field, account) {
		const networkId = Services.getUserStorage().getNetworkId();

		const name = account !== field.get('id') ? (
			<a target="_blank" href={`${EXPLORER_URL[networkId]}${field.get('link')}`}>
				{field.get('value')}
			</a>
		) : <span>{field.get('value')}</span>;

		return (
			<span className="action-info">
				<span className="action-label">
					<FormattedMessage id={field.get('label')} />:
				</span>
				{name}
			</span>
		);
	}

	render() {
		const { intl, language, transaction } = this.props;

		if (!transaction.size) {
			return null;
		}

		const title = intl.formatMessage({ id: 'wallet.transaction.title' });

		return (
			<div className="last-transaction">
				<div className="label">{title}</div>
				<div className="line">
					<span className="date">
						{FormatHelper.getLocaleTransformDate(transaction.get('timestamp'), language, 'DD MMM hh:mm')}
					</span>
					<span className="action">
						{transaction.get('name') && <FormattedMessage id={transaction.get('name')} />}
					</span>
					<div className="balance">
						<span className="coins">
							{
								this.renderAmount(
									transaction.getIn(['amount', 'value']),
									transaction.getIn(['asset', 'precision']),
								)
							}
						</span>
						<span className="currency">{transaction.getIn(['asset', 'value']) || ECHO_ASSET_SYMBOL}</span>
					</div>
				</div>
				<div className="line">
					{transaction.get('from') && this.renderParticipant(transaction.get('from'), transaction.get('account'))}
					{transaction.get('subject') && this.renderParticipant(transaction.get('subject'), transaction.get('account'))}
				</div>
			</div>
		);
	}

}

LastTransaction.propTypes = {
	intl: intlShape.isRequired,
	language: PropTypes.string.isRequired,
	transaction: PropTypes.object.isRequired,
};

export default injectIntl(LastTransaction);
