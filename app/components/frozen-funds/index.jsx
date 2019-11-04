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
			showTable: true,
			// t: null,
		};
		this.showForm = this.showForm.bind(this);
		this.subscription = null;
	}

	componentDidMount() {
		this.props.getFrozenBalance();
		this.subscribe();
		// this.setState({ t: setInterval(this.props.getFrozenBalance, 3000) });
	}

	componentWillUnmount() {
		this.unsubscribe();
		// clearInterval(this.state.t);
	}

	subscribe() {
		this.subscription = newOperationSubscription(this.props.filter);

		if (this.subscription) {
			this.subscription = this.subscription.subscribe(({ data: { newOperation } }) => {
				console.log(newOperation);
				// this.props.setNewTransaction(newOperation);
			});
		}
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}
	}

	showForm() {
		this.setState((prevState) => ({ showForm: !prevState.showForm }));
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
								? <FrozenForm />
								: (
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
											onClick={this.showForm}
											content={buttonTitle}
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
