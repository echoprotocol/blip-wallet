import React from 'react';
import Media from 'react-media';

import Avatar from '../avatar';

class FrozenFundsTable extends React.Component {

	renderRow() {
		return (
			<React.Fragment>
				<tr className="line">
					<td className="amount"><span>10000000000</span> ECHO</td>
					<td className="account"><Avatar accountName="test" /> <span>LOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLO</span> </td>
					<td className="coefficient">3.0</td>
					<td className="period">3 months</td>
					<td className="expiration">23 Jan 2020</td>
				</tr>
			</React.Fragment>
		);
	}

	render() {
		return (
			<table className="frozen-table-wrap">
				<thead className="frozen-table-header">
					<tr className="line">
						<th className="amount">Amount</th>
						<th className="account">Account</th>
						<th className="coefficient">
							<Media queries={{ small: { maxWidth: 1132 } }}>
								{(matches) => (matches.small ? (
									<p>Coeff.</p>
								) : (
									<p>Coefficient</p>
								))
								}
							</Media>
						</th>
						<th className="period">Period</th>
						<th className="expiration">Expiration</th>
					</tr>
				</thead>
				<tbody className="frozen-table-body">
					{this.renderRow()}
				</tbody>
			</table>
		);
	}

}

export default FrozenFundsTable;
