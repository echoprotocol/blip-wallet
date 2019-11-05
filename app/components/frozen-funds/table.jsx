import React from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';
import BN from 'bignumber.js';
import { FormattedMessage } from 'react-intl';
import { FREEZE_FUNDS_PERIODS, ECHO_ASSET_PRECISION } from '../../constants/global-constants';
import Avatar from '../avatar';

class FrozenFundsTable extends React.Component {

	formatDate(date) {
		const parsedDate = new Date(Date.parse(date)).toDateString();
		const d = parsedDate.substring(parsedDate.indexOf(' '));
		return d;
	}

	formatAmount(amount) {
		return new BN(amount).div(10 ** ECHO_ASSET_PRECISION).toString(10);
	}

	renderRows(frozenBalances) {
		if (frozenBalances) {
			return frozenBalances.sort((f1, f2) => Date.parse(f1.unfreeze_time) - Date.parse(f2.unfreeze_time))
				.map((fBalance) => {
					const period = FREEZE_FUNDS_PERIODS.find((f) => f.fullCoefficient === fBalance.multiplier).shortText;
					const formattedDate = this.formatDate(fBalance.unfreeze_time);
					const formattedAmount = this.formatAmount(fBalance.balance.amount);
					return (
						<tr className="line" key={fBalance.id}>
							<td className="amount">
								<span>{formattedAmount}</span> ECHO
							</td>
							<td className="account">
								<Avatar accountName="test" /> <span>{fBalance.ownerName}</span>
							</td>
							<td className="coefficient">
								{fBalance.multiplier / 10000}
							</td>
							<td className="period">
								{period}&nbsp;<FormattedMessage id="frozenFunds.table.months" />
							</td>
							<td className="expiration">
								{formattedDate}
							</td>
						</tr>

					);
				});
		}
		return null;
	}

	render() {
		const { frozenBalances } = this.props;
		return (
			<table className="frozen-table-wrap">
				<thead className="frozen-table-header">
					<tr className="line">
						<th className="amount"><FormattedMessage id="frozenFunds.table.amount" /></th>
						<th className="account"><FormattedMessage id="frozenFunds.table.account" /></th>
						<th className="coefficient">
							<Media queries={{ small: { maxWidth: 1132 } }}>
								{(matches) => (matches.small ? (
									<p><FormattedMessage id="frozenFunds.table.coefSmall" /></p>
								) : (
									<p><FormattedMessage id="frozenFunds.table.coef" /></p>
								))
								}
							</Media>
						</th>
						<th className="period"><FormattedMessage id="frozenFunds.table.period" /></th>
						<th className="expiration"><FormattedMessage id="frozenFunds.table.expiration" /></th>
					</tr>
				</thead>
				<tbody className="frozen-table-body">
					{this.renderRows(frozenBalances)}
				</tbody>
			</table>
		);
	}

}

FrozenFundsTable.defaultProps = {
	frozenBalances: [],
};

FrozenFundsTable.propTypes = {
	frozenBalances: PropTypes.array,
};

export default FrozenFundsTable;
