import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Button } from 'semantic-ui-react';
// import PropTypes from 'prop-types';
import {
	// FormattedMessage,
	injectIntl,
	// intlShape,
} from 'react-intl';

import FrozenForm from './form';
import FrozenTable from './table';

class FrozenFunds extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showForm: false,
			showTable: true,
		};
	}

	toggleForm(state) {
		this.setState(({ showForm: state }));
	}

	render() {
		const { showTable, showForm } = this.state;

		return (
			<div className="page-wrap">
				<div className="page">
					<PerfectScrollbar className="page-scroll">
						<div className="frozen-wrap">
							{showForm
								? (
									<FrozenForm
										hideForm={() => this.toggleForm(false)}
										{...this.props}
									/>
								) : (
									<React.Fragment>
										<h1 className="frozen-page-title">frozen funds</h1>
										<div className="text-about">
											If you take part in the blocks creation process, the sum you freeze will turn into a new amount after unfreezing (depending on the duration of freezing) when re-calculated with the coefficient and considered while distributing the reward
										</div>
										{showTable && <FrozenTable /> }
										<Button
											className="btn-freeze"
											onClick={() => this.toggleForm(true)}
											content="Freeze funds"
										/>
									</React.Fragment>
								)
							}
						</div>
					</PerfectScrollbar>
				</div>
			</div>
		);
	}

}


export default injectIntl(FrozenFunds);
