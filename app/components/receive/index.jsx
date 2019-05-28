import React from 'react';
// import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react'; // Input,
import { Dropdown } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PerfectScrollbar from 'react-perfect-scrollbar';
// import classnames from 'classnames';
import { injectIntl } from 'react-intl';
import Qr from 'qrcode.react';
import Avatar from '../avatar';
// import InputDropdown from '../input-dropdown';

class Send extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			copied: false,
			qrSize: null,
		};
		this.qrRef = React.createRef();
		this.listener = this.updateQrSize.bind(this);
	}

	componentDidMount() {
		this.updateQrSize();
		window.addEventListener('resize', this.listener);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.listener);
	}

	onCopy() {
		this.setState({ copied: true });
		setTimeout(() => {
			this.setState({ copied: false });
		}, 2500);
	}

	updateQrSize() {
		const qrSize = this.qrRef.current.offsetHeight;
		if (qrSize !== this.state.avatarSize) {
			this.setState({ qrSize });
		}
	}


	render() {

		const { copied, qrSize } = this.state;
		return (
			<div className="page">
				<PerfectScrollbar className="page-in-scroll">
					<div className="page-in-wrap">
						<div className="title">Copy account name</div>
						<p className="description-block">
                            Copy one of the account names attached to Blip and share with a sender to request a transaction.
						</p>
						<div className="accounts-list sm">
							<div className="account-item">
								<div className="account-info">
									<div className="avatar">
										<Avatar accountName="blip123" />
									</div>
									<div className="copy-name">
										<div className="name">blip123blip123blip123blip123blip12blip123blip123blip123blip123</div>

										<CopyToClipboard
											onCopy={() => this.onCopy()}
											text="blip123"
										>
											<Button
												className="btn-copy gray sm"
												content={(
													<React.Fragment>
														<Icon className="copy" />
														{
															copied && <div className="copy-label">Copied to clipboard</div>
														}
													</React.Fragment>
												)}
											/>
										</CopyToClipboard>
									</div>
								</div>
								<div className="currency-wrap">
									<div className="balance">
                                        120.82000
										<div className="currency">Echo</div>
									</div>
									<div className="assets">+3 assets</div>

								</div>
							</div>
							<div className="account-item">
								<div className="account-info">
									<div className="avatar">
										<Avatar accountName="blip321" />
									</div>
									<div className="copy-name">
										<div className="name">blip123blip123blip123blip123blip12blip123blip123blip123blip123</div>

										<CopyToClipboard
											onCopy={() => this.onCopy()}
											text="blip321"
										>
											<Button
												className="btn-copy gray sm"
												content={(
													<React.Fragment>
														<Icon className="copy" />
														{
															copied && <div className="copy-label">Copied to clipboard</div>
														}
													</React.Fragment>
												)}
											/>
										</CopyToClipboard>
									</div>
								</div>
								<div className="currency-wrap">
									<div className="balance">
                                        120.82000
										<div className="currency">Echo</div>
									</div>
									<div className="assets">+3 assets</div>

								</div>
							</div>
						</div>

						<div className="title">Generate QR-Code</div>
						<p className="description-block">
                            Fill in the information about payment type, assets etc. to get unique QR code.
						</p>

						<div className="form-wrap">
							<div className="line">

								<div className="line-label">
									<span className="line-label-text">Select account</span>
								</div>

								<div className="line-content">
									<Dropdown className="white select-account">
										<Dropdown.Toggle variant="Info">
											<Avatar accountName="sdsd" />
											<span className="dropdown-toggle-text">
												asdasdasdasdasdasd
											</span>
											<span className="carret" />
										</Dropdown.Toggle>

										<Dropdown.Menu>
											<PerfectScrollbar>
												{'here will dropdown itens'}
											</PerfectScrollbar>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							</div>
							{/*
								<div className="line">
									<div className="line-label">
										<span className="line-label-text">Select asset and amount</span>
									</div>
									<div className="line-content">
										<InputDropdown
											title="Amount"
											name="amount"
											value="Amount"
											errorText=""
											path={{ field: 'selectedBalance' }}
											data={{}}
											placeholder="Amount"
										/>
									</div>
								</div>
							*/}
							<div className="line">
								<div className="line-label" />
								<div className="line-content">
									<div className="qr-wrap">
										<div ref={this.qrRef} className="qr">
											<Qr
												value="https://echo.org/siodfwjs2/203wds3dsddsd23asd23sad"
												size={qrSize}
												fgColor="#3F4A52"
												bgColor="transparent"
											/>
										</div>
										<div className="qr-info">
											<div className="qr-link">
												<span className="qr-link-content">
													https://echo.org/siodfwjs2/203wds3dsddsd23asd23sad
												</span>
												<Button
													className="btn-copy gray sm"
													content={(
														<React.Fragment>
															<Icon className="copy" />
															{
																copied && <div className="copy-label">Copied to clipboard</div>
															}
														</React.Fragment>
													)}
												/>
											</div>
											<div className="qr-description">
												QR code and link are generated automatically. You can copy it and send to someone for payment.
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</PerfectScrollbar>
			</div>
		);
	}

}

Send.propTypes = {
	// form: PropTypes.object.isRequired,
};

Send.defaultProps = {};

export default injectIntl(Send);
