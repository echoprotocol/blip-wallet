import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ImportAccount extends React.Component {

	componentDidMount() {
		this.nameInput.focus();
	}

	render() {
		const { error, errorMessage } = this.props;
		return (

			<div className="authorization-form">
				<div className="form-content">
					<div className="lines">
						<div className="line">
							<div className="line-label">
								{'Account name'}
							</div>
							<div className="line-content">
								<div className="field">
									<Input
										placeholder="Account name"
										ref={(input) => { this.nameInput = input; }}
										error={error}
										loading={false}
										fluid
									/>
									{
										errorMessage
										&& (
											<div className="error-message">
												{errorMessage}
											</div>
										)
									}
								</div>

							</div>

						</div>
						<div className="line">
							<div className="line-label">
								{'WIF key'}
							</div>
							<div className="line-content">
								<div className="field">
									<Input
										placeholder="WIF key"
										error={error}
										loading={false}
										fluid
									/>
									{
										errorMessage
										&& (
											<div className="error-message">
												{errorMessage}
											</div>
										)
									}
									<div className="hints">
										<div className="hint">You can import any Echo account here</div>
									</div>
								</div>

							</div>

						</div>
					</div>
					<div className="form-action">
						<div className="line">
							<div className="line-label" />
							<div className="line-content">
								<div className="btns-wrap">

									<Button
										disabled
										className="btn-primary"
										content={<span className="text">Import account</span>}
									/>
								</div>
							</div>
						</div>

					</div>

				</div>

			</div>
		);
	}

}
ImportAccount.propTypes = {
	error: PropTypes.bool,
	errorMessage: PropTypes.string,
};

ImportAccount.defaultProps = {
	error: false,
	errorMessage: '',
};

export default ImportAccount;
