import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import { BALANCE_FREEZE_OPERATION_ID, BALANCE_UNFREEZE_OPERATION_ID } from '../../constants/global-constants';
import FrozenForm from './form';
import FrozenTable from './table';
import { newOperation as newOperationSubscription } from '../../services/subscriptions/transaction-subscriptions';


class FrozenFunds extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showForm: false,
			showTable: true,
		};
		this.subscription = null;
	}

	componentDidMount() {
		this.props.getFrozenBalance();
		this.subscribe(this.props.filter);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	subscribe(filter) {
		this.subscription = newOperationSubscription(filter);
		console.log(this.subscription);
		if (this.subscription) {
			console.log('#########');
			this.subscription = this.subscription.subscribe(({ data: { newOperation } }) => {
				if (newOperation.id === BALANCE_FREEZE_OPERATION_ID || newOperation.id === BALANCE_UNFREEZE_OPERATION_ID) {
					this.props.getFrozenBalance();
				}
			});
		}
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}
	}

	toggleForm(state) {
		this.setState(({ showForm: state }));
	}

	render() {
		const { showTable, showForm } = this.state;
		const { frozenBalances, intl } = this.props;
		const buttonTitle = intl.formatMessage({ id: 'frozenFunds.buttonTitle' });
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
										<h1 className="frozen-page-title">
											<FormattedMessage id="frozenFunds.title" />
										</h1>
										<div className="text-about">
											<FormattedMessage id="frozenFunds.about" />
										</div>
										{showTable && <FrozenTable frozenBalances={frozenBalances} />}
										<Button
											className="btn-freeze"
											content={buttonTitle}
											onClick={() => this.toggleForm(true)}
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
FrozenFunds.defaultProps = {
	frozenBalances: [],
};

FrozenFunds.propTypes = {
	frozenBalances: PropTypes.array,
	filter: PropTypes.object.isRequired,
	getFrozenBalance: PropTypes.func.isRequired,
	intl: intlShape.isRequired,
};

export default injectIntl(FrozenFunds);
