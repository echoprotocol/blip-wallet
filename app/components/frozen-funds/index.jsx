import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import FrozenForm from './form';
import FrozenTable from './table';

class FrozenFunds extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showForm: false,
			showTable: true,
			t: null,
		};
		this.showForm = this.showForm.bind(this);
	}

	componentDidMount() {
		this.props.getFrozenBalance();
		this.setState({ t: setInterval(this.props.getFrozenBalance, 3000) });
	}

	componentWillUnmount() {
		clearInterval(this.state.t);
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
	getFrozenBalance: PropTypes.func.isRequired,
	intl: intlShape.isRequired,
};

export default injectIntl(FrozenFunds);
