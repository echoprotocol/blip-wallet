import React from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FREEZE_COEF_BY_TIME, FREEZE_COEF_FACTOR, FREEZE_BALANCE_PERCISION } from '../../constants/global-constants';
import Avatar from '../avatar';

class FrozenFundsTable extends React.Component {

	formatDate(date) {
		const parsedDate = new Date(Date.parse(date)).toDateString();
		const d = parsedDate.substring(parsedDate.indexOf(' '));
		return d;
	}

	renderRows(frozenBalances) {
		let frozenRowTemplate;
		frozenBalances.sort((f1, f2) => Date.parse(f1.unfreeze_time) - Date.parse(f2.unfreeze_time));
		if (frozenBalances) {
			frozenRowTemplate = frozenBalances.map((fBalance) => {
				const period = FREEZE_COEF_BY_TIME[fBalance.multiplier / FREEZE_COEF_FACTOR];
				const formattedDate = this.formatDate(fBalance.unfreeze_time);
				return (
					<tr className="line" key={fBalance.id}>
						<td className="amount">
							<span>{fBalance.balance.amount / FREEZE_BALANCE_PERCISION}</span> ECHO
						</td>
						<td className="account">
							<Avatar accountName="test" /> <span>{fBalance.ownerName}</span>
						</td>
						<td className="coefficient">
							{fBalance.multiplier / 10000}
						</td>
						<td className="period">
							{period} <FormattedMessage id="frozenFunds.table.months" />
						</td>
						<td className="expiration">
							{formattedDate}
						</td>
					</tr>

				);
			});
			return frozenRowTemplate;
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
