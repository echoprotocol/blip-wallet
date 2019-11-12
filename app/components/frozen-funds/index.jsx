import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import FrozenForm from './form';
import FrozenTable from './table';
import { newOperation as newOperationSubscription } from '../../services/subscriptions/transaction-subscriptions';


class FrozenFunds extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showForm: false,
		};
		this.subscription = null;
	}

	componentDidMount() {
		this.props.getFrozenBalance();
		this.subscribe();
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	async subscribe() {
		await this.props.setFreezeDefaultFilter();
		const { filter } = this.props;
		this.subscription = newOperationSubscription(filter);
		if (this.subscription) {
			this.subscription = this.subscription.subscribe(() => {
				this.props.getFrozenBalance();
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
		const { showForm } = this.state;
		const { frozenBalances, intl } = this.props;
		const buttonTitle = intl.formatMessage({ id: 'freeze_funds.global.buttonTitle' });
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
											<FormattedMessage id="freeze_funds.global.title" />
										</h1>
										<div className="text-about">
											<FormattedMessage id="freeze_funds.global.about" />
										</div>
										{frozenBalances.length > 0 && <FrozenTable frozenBalances={frozenBalances} />}
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
	setFreezeDefaultFilter: PropTypes.func.isRequired,
	intl: intlShape.isRequired,
};

export default injectIntl(FrozenFunds);
