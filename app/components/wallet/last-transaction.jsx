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

	renderParticipant(field, accounts) {
		const networkId = Services.getUserStorage().getNetworkId();

		const name = !accounts.has(field.get('id')) ? (
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
		const {
			intl, language, transaction, accounts,
		} = this.props;

		const title = intl.formatMessage({ id: 'wallet.transaction.title' });

		if (!transaction.size) {
			return null;
		}

		return (
			<div className="last-transaction">
				<div className="label">{title}</div>
				<div className="line">
					<span className="date">
						{FormatHelper.transformDate(transaction.get('timestamp'), language, 'DD MMM, HH:mm')}
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
					{transaction.get('from') && this.renderParticipant(transaction.get('from'), accounts)}
					{transaction.get('subject') && this.renderParticipant(transaction.get('subject'), accounts)}
				</div>
			</div>
		);
	}

}

LastTransaction.propTypes = {
	intl: intlShape.isRequired,
	language: PropTypes.string.isRequired,
	transaction: PropTypes.object.isRequired,
	accounts: PropTypes.object.isRequired,
};

export default injectIntl(LastTransaction);
