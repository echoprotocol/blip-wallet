import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import classnames from 'classnames';
import Avatar from '../avatar';
import {
	KEY_CODE_TAB,
	KEY_CODE_ARROW_DOWN,
	KEY_CODE_ARROW_UP,
} from '../../constants/global-constants';

class AccountsMultiDropdown extends React.Component {

	constructor(props) {
		super(props);

		this.refList = [];

		this.state = {
			opened: false,
			focus: false,
			dropdownData: [
				{
					text: 'Account1',
					active: true,
					id: '0',
				},

				{
					text: 'Account2',
					active: false,
					id: '2',
				},
				{
					text: 'Account3',
					active: false,
					id: '3',
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

	onKeyDown(e, index) {
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
				if (index === (this.refList.length - 1)) {
					this.searchInput.focus();
				} else {
					this.refList[index + 1].focus();
				}

				e.preventDefault();
				break;
			case KEY_CODE_ARROW_UP:
				if (index === 0) {
					this.searchInput.focus();
				} else {
					this.refList[index - 1].focus();
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
						this.refList[i].focus();
						break;
					}
				}

				e.preventDefault();
				break;
			}
			case KEY_CODE_ARROW_UP: {
				this.refList[this.refList.length - 1].focus();

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
		const { hints, label } = this.props;
		return (
			<div className="dropdown-wrap">
				{
					!!label && (
						<div className="dropdown-label">
							{label}
						</div>
					)}
				<div ref={this.setMenuRef}>

					<Dropdown
						className={classnames('multi-dropdown pink', { focus })}
						onFocus={() => this.setFocus(true)}
						onBlur={() => this.setFocus(false)}
						show={opened}
					>
						<Dropdown.Toggle

							onClick={() => this.toggleDropdown()}
							variant="Info"
						>
							<span className="dropdown-toggle-text">
                                Accounts selected: 1
							</span>
							<span className="carret" />
						</Dropdown.Toggle>

						{opened && (
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
										dropdownData.map(({
											text, value, active, id,
										}, i) => (
											<div className="checkbox" key={id}>
												<input
													ref={(ref) => { this.refList[i] = ref; }}
													className={classnames({ active })}
													tabIndex={0}
													onKeyPress={
														(e) => {
															this.onItemKeyPress(e, text, value);
															e.preventDefault();
														}
													}
													onKeyDown={(e) => this.onKeyDown(e, i)}
													type="checkbox"
													name="multi-select"
													id={`ac-${id}`}
												/>

												<label htmlFor={`ac-${id}`}>
													<Avatar accountName={text} />
													<span className="label-text">
														{text}
													</span>
												</label>
											</div>
										))
									}
								</PerfectScrollbar>
							</Dropdown.Menu>
						)}
					</Dropdown>

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
			</div>
		);
	}

}

AccountsMultiDropdown.propTypes = {
	hints: PropTypes.array,
	label: PropTypes.string,
};

AccountsMultiDropdown.defaultProps = {
	hints: [],
	label: '',
};

export default AccountsMultiDropdown;
