import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import classnames from 'classnames';
import {
	KEY_CODE_TAB,
	KEY_CODE_ARROW_DOWN,
	KEY_CODE_ARROW_UP,
} from '../../constants/global-constants';

class InputDropdown extends React.Component {

	constructor(props) {
		super(props);

		this.refList = [];

		this.state = {
			opened: false,
			focus: false,
			dropdownData: [
				{
					id: 0,
					title: 'Assets',
					list: [
						{
							text: 'ECHO',
							value: '0',
							active: true,
						},
						{
							text: 'BTC (Bitcoin)',
							value: '0',
							active: false,
						},
					],
				},
				{
					id: 1,
					title: 'Tokens',
					list: [
						{
							text: 'AND (ANDREYCOIN)',
							value: '0',
							active: false,
						},
						{
							text: 'SDRF',
							value: '0',
							active: false,
						},
						{
							text: 'SDFV',
							value: '0',
							active: false,
						},
					],
				},
			],
		};

		this.setMenuRef = this.setMenuRef.bind(this);

		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
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


	setMenuRef(node) {
		this.menuRef = node;
	}

	setFocus(focus) {
		this.setState({ focus });
	}

	toggleDropdown() {
		const { opened } = this.state;
		this.setState({ opened: !opened });
	}

	handleClickOutside(event) {

		if (this.menuRef && (!this.menuRef.contains(event.target)) && this.searchInput) {
			this.searchInput.blur();
			this.setState({
				opened: false,
			});
		}

	}

	render() {
		const { opened, dropdownData, focus } = this.state;
		const { title, hints } = this.props;
		return (
			<React.Fragment>
				<Input
					error={false}
					disabled={false}
					ref={(amountInput) => { this.amountInput = amountInput; }}
					className={classnames('field input-dropdown', { focus })}
					placeholder={title}
					onFocus={() => this.setFocus(true)}
					onBlur={() => this.setFocus(false)}
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
									<span className="dropdown-toggle-text">ECHO</span>
									<span className="carret" />
								</Dropdown.Toggle>

								<Dropdown.Menu role="menu" alignRight>

									<input
										type="text"
										placeholder="Asset or token name"
										onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
										onKeyDown={(e) => { this.onInputKeyDown(e); }}
										ref={(node) => { this.searchInput = node; }}
									/>
									<PerfectScrollbar className="input-dropdown-scroll">
										{
											dropdownData.map((elem, index) => (
												elem.list.length
												&& (

													<div className={elem.title.toLowerCase()} key={elem.title}>
														<div className="title">{elem.title}</div>
														{
															elem.list.map(({ text, value, active }, i) => (

																<a
																	key={Math.random()}
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
																		this.handleClick(text, value);
																		e.preventDefault();
																	}}
																> {text}
																</a>
															))
														}
													</div>
												)
											))
										}
									</PerfectScrollbar>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					)}
				/>
				<div className="hints">
					{
						!!hints.length && hints.map((hint) => (
							<div key={hint} className="hint">
								{hint}
							</div>
						))
					}

				</div>
			</React.Fragment>
		);
	}

}

InputDropdown.propTypes = {
	title: PropTypes.string.isRequired,
	hints: PropTypes.array,
};

InputDropdown.defaultProps = {
	hints: [],
};

export default InputDropdown;
