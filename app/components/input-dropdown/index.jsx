import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import classnames from 'classnames';
import { injectIntl, intlShape } from 'react-intl';

import {
	KEY_CODE_TAB,
	KEY_CODE_ARROW_DOWN,
	KEY_CODE_ARROW_UP,
	ECHO_ASSET_SYMBOL,
	KEY_CODE_ENTER,
	KEY_CODE_SPACE,
} from '../../constants/global-constants';

class InputDropdown extends React.Component {

	constructor(props) {
		super(props);

		this.refList = [];

		this.state = {
			currentVal: '',
			opened: false,
			focus: false,
			assetsList: [],
			tokensList: [],
			search: '',
		};

		this.setMenuRef = this.setMenuRef.bind(this);

		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
		this.setDropdownBalances();
		document.addEventListener('mousedown', this.handleClickOutside);
		return null;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)) {
			return false;
		}
		return true;

	}

	componentDidUpdate(prevProps, prevState) {
		const { opened } = this.state;
		const { opened: prevOpened } = prevState;

		if (opened && (opened !== prevOpened)) {
			this.searchInput.focus();
		}

		const { from } = this.props.data;
		const { from: prevFrom } = prevProps.data;

		if (from !== prevFrom) {
			this.setDropdownBalances();
		}
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	onKeyDown(e, index, row) {
		const code = e.keyCode || e.which;


		switch (code) {
			case KEY_CODE_TAB:
				if (this.state.opened) {
					this.setState({
						opened: false,
					});
				}
				break;
			case KEY_CODE_ARROW_DOWN:
				if ((row === this.refList[index].length - 1) && (index === this.refList.length - 1)) {
					this.searchInput.focus();
				} else if (
					(row === this.refList[index].length - 1)
                    && (index !== this.refList.length - 1)
				) {
					this.refList[index + 1][0].focus();
				} else if ((row !== this.refList[index].length - 1)) {
					this.refList[index][row + 1].focus();
				}

				e.preventDefault();
				break;
			case KEY_CODE_ARROW_UP:
				if ((index === 0) && (row === 0)) {
					this.searchInput.focus();
				} else if (row !== 0) {
					this.refList[index][row - 1].focus();
				} else if ((row === 0) && (index !== 0)) {
					if (!this.refList[index - 1]) {
						this.searchInput.focus();

						e.preventDefault();
						break;
					}
					this.refList[index - 1][this.refList[index - 1].length - 1].focus();
				}

				e.preventDefault();
				break;
			default:
				return null;
		}

		return null;
	}

	onInputKeyDown(e) {
		const code = e.keyCode || e.which;
		switch (code) {
			case KEY_CODE_TAB:
				if (this.state.opened) {
					e.preventDefault();
					e.target.blur();
					this.setState({
						opened: false,
					});

				}
				break;
			case KEY_CODE_ARROW_DOWN: {
				const refsLength = this.refList.length;
				for (let i = 0; i < refsLength; i += 1) {
					if (this.refList[i]) {
						e.preventDefault();
						this.refList[i][0].focus();
						break;
					}
				}

				e.preventDefault();
				break;
			}
			case KEY_CODE_ARROW_UP: {
				const rowLength = this.refList[this.refList.length - 1].length - 1;
				this.refList[this.refList.length - 1][rowLength].focus();

				e.preventDefault();
				break;
			}
			default:
				return null;
		}

		return null;
	}

	onItemKeyPress(e, text, value) {
		const code = e.keyCode || e.which;

		if (this.state.opened && [KEY_CODE_ENTER, KEY_CODE_SPACE].includes(code)) {
			this.handleClick(e, text, value);
		}
	}

	onChange(e) {
		this.setState({
			search: e.target.value,
		});
	}

	setMenuRef(node) {
		this.menuRef = node;
	}

	setFocus(focus) {
		this.setState({ focus });
	}

	setDropdownBalances() {
		const { assetsList, tokensList } = this.getSymbols();
		this.setState({ assetsList, tokensList });
	}

	getSymbols() {
		const assetsList = [];
		const tokensList = [];

		if (!this.props.data) {
			return assetsList;
		}

		const {
			account, balances, tokens, from,
		} = this.props.data;

		const activeAccountId = from || account;
		let { hiddenAssets } = this.props.data;
		hiddenAssets = hiddenAssets || [];

		balances.mapEntries(([balanceId, { accountId, symbol, assetId }]) => {
			if (accountId === activeAccountId && !hiddenAssets.includes(assetId)) {
				if (symbol === ECHO_ASSET_SYMBOL) {
					assetsList.unshift({ text: symbol, value: balanceId, active: false });
					return null;
				}

				assetsList.push({ text: symbol, value: balanceId, active: false });
			}

			return null;
		});

		if (tokens) {
			tokens.forEach((token) => {
				if (activeAccountId === token.getIn(['account', 'id']) && !hiddenAssets.includes(token.getIn(['contract', 'id']))) {
					tokensList.push({
						text: token.getIn(['contract', 'token', 'symbol']),
						value: token.getIn(['contract', 'id']),
						active: false,
					});
				}
			});
		}

		return { assetsList, tokensList };
	}

	toggleDropdown() {
		const { globalLoading } = this.props;

		if (globalLoading) {
			return null;
		}

		const { opened } = this.state;
		this.setState({ opened: !opened });

		return null;
	}

	handleClickOutside(event) {

		if (this.menuRef && (!this.menuRef.contains(event.target)) && this.searchInput) {
			this.searchInput.blur();
			this.setState({
				opened: false,
			});
		}

	}

	handleClick(e, text, value) {
		e.preventDefault();
		this.setState({
			currentVal: text,
			opened: false,
			search: '',
		});

		const { path } = this.props;

		if (path) {
			this.props.setValue(path.field, value);
			this.props.setFee();
		}
	}

	render() {
		const {
			opened, focus, assetsList, tokensList, currentVal, search,
		} = this.state;
		const {
			title, hints, disable, errorText, value: inputValue, name, intl, placeholder,
		} = this.props;

		const assetsTitle = intl.formatMessage({ id: 'send.dropdown.assets' });
		const tokensTitle = intl.formatMessage({ id: 'send.dropdown.tokens' });

		const dropdownData = [
			{
				id: 0,
				title: assetsTitle,
				list: [],
			},
			{
				id: 1,
				title: tokensTitle,
				list: [],
			},
		];

		if (assetsList) {
			dropdownData[0].list = assetsList.filter(({ text }) => text.toLowerCase().includes(search));
		}

		if (tokensList) {
			dropdownData[1].list = tokensList.filter(({ text }) => text.toLowerCase().includes(search));
		}

		const isResultsExists = dropdownData.some((d) => d.list.length);

		return (
			<div className="field">
				<Input
					name={name}
					value={inputValue}
					error={!!errorText}
					disabled={disable}
					ref={(amountInput) => { this.amountInput = amountInput; }}
					className={classnames('field input-dropdown', { focus })}
					placeholder={title}
					onFocus={() => this.setFocus(true)}
					onBlur={() => this.setFocus(false)}
					onChange={(e) => this.props.onChange(e)}
					onKeyPress={(e) => this.props.onKeyPress(e)}
					action={(
						<div ref={this.setMenuRef}>
							<Dropdown
								onFocus={() => this.setFocus(true)}
								onBlur={() => this.setFocus(false)}
								show={opened}
							>
								<Dropdown.Toggle

									onClick={() => this.toggleDropdown()}
									variant="Info"
								>
									<span className="dropdown-toggle-text">{currentVal || 'ECHO'}</span>
									<span className="carret" />
								</Dropdown.Toggle>

								<Dropdown.Menu role="menu" alignRight>

									<input
										value={search}
										type="text"
										placeholder={placeholder}
										onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
										onKeyDown={(e) => { this.onInputKeyDown(e); }}
										onChange={(e) => this.onChange(e)}
										ref={(node) => { this.searchInput = node; }}
									/>
									<PerfectScrollbar className="input-dropdown-scroll">
										{
											isResultsExists
												? dropdownData.map((elem, index) => (
													elem.list.length
														? (

															<div className={elem.title.toLowerCase()} key={elem.title}>
																<div className="title">{elem.title}</div>
																{
																	elem.list.map(({ text, value, active }, i) => (

																		<a
																			key={i.toString()}
																			ref={(ref) => {
																				if (ref) {
																					if (!this.refList[index]) {
																						this.refList[index] = [];
																					}
																					this.refList[index][i] = ref;
																				}
																			}}
																			href="/"
																			className={classnames({ active })}
																			tabIndex={0}
																			onKeyPress={
																				(e) => {
																					this.onItemKeyPress(e, text, value);
																					e.preventDefault();
																				}
																			}
																			onKeyDown={(e) => this.onKeyDown(e, index, i)}
																			onClick={(e) => {
																				this.handleClick(e, text, value);
																			}}
																		> {text}
																		</a>
																	))
																}
															</div>
														) : ''
												)) : <div className="no-results">No results</div>
										}
									</PerfectScrollbar>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					)}
				/>
				{
					!!errorText
					&& (
						<div className="error-message">
							{errorText}
						</div>
					)
				}
				<div className="hints">
					{
						!!hints.length && hints.map((hint) => (
							<div key={hint} className="hint">
								{hint}
							</div>
						))
					}

				</div>
			</div>
		);
	}

}

InputDropdown.propTypes = {
	title: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	disable: PropTypes.bool,
	globalLoading: PropTypes.bool,
	errorText: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.any,
	hints: PropTypes.array,
	path: PropTypes.object,
	data: PropTypes.object,
	setValue: PropTypes.func,
	onChange: PropTypes.func,
	onKeyPress: PropTypes.func,
	setFee: PropTypes.func,
	intl: intlShape.isRequired,
};

InputDropdown.defaultProps = {
	hints: [],
	disable: false,
	globalLoading: false,
	errorText: '',
	placeholder: '',
	value: '',
	path: null,
	setValue: null,
	onChange: null,
	onKeyPress: null,
	setFee: null,
	data: null,
};

export default injectIntl(InputDropdown);
