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

		if (opened !== prevOpened) {
			if (opened) {
				this.searchInput.focus();
			} else {
				this.searchInput.value = '';
			}
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
					this.props.close();
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
					this.props.close();

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

	onItemToggle(e, item) {
		e.preventDefault();
		this.props.toggle(item);
	}

	onSearch(e) {
		e.preventDefault();
		this.props.search(e.target.value);
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

		if (opened) {
			this.props.close();
		}
	}

	handleClickOutside(event) {

		if (this.menuRef && (!this.menuRef.contains(event.target)) && this.searchInput) {
			this.searchInput.blur();
			this.setState({
				opened: false,
			});
			this.props.close();
		}

	}

	render() {
		const { opened, focus } = this.state;
		const {
			label, info, placeholder, accounts,
		} = this.props;

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

							onClick={(k) => this.toggleDropdown(k)}
							variant="Info"
						>
							{!!info && (<span className="dropdown-toggle-text">{info}</span>)}
							<span className="carret" />
						</Dropdown.Toggle>

						{opened && (
							<Dropdown.Menu role="menu" alignRight>
								<input
									type="text"
									placeholder={placeholder}
									onInput={(e) => this.onSearch(e)}
									onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
									onKeyDown={(e) => { this.onInputKeyDown(e); }}
									ref={(node) => { this.searchInput = node; }}
								/>
								<PerfectScrollbar className="input-dropdown-scroll">
									{
										accounts && accounts.size ? accounts.map((a, i) => (
											<div className="checkbox" key={a.get('id')}>
												<input
													ref={(ref) => { this.refList[i] = ref; }}
													tabIndex={0}
													onKeyDown={(e) => this.onKeyDown(e, i)}
													onKeyPress={(e) => this.onItemToggle(e, a)}
													onChange={() => {}}
													type="checkbox"
													name="multi-select"
													id={`ac-${a.get('id')}`}
													checked={a.get('selected')}
												/>

												<label htmlFor={`ac-${a.get('id')}`} onClick={(e) => this.onItemToggle(e, a)}>
													<Avatar accountName={a.get('name')} />
													<span className="label-text">
														{a.get('name')}
													</span>
												</label>
											</div>
										)) : (<div>No Results</div>)
									}
								</PerfectScrollbar>
							</Dropdown.Menu>
						)}
					</Dropdown>
				</div>
			</div>
		);
	}

}

AccountsMultiDropdown.propTypes = {
	label: PropTypes.string,
	info: PropTypes.string,
	placeholder: PropTypes.string,
	accounts: PropTypes.object,
	toggle: PropTypes.func.isRequired,
	search: PropTypes.func.isRequired,
	close: PropTypes.func,
};

AccountsMultiDropdown.defaultProps = {
	label: '',
	info: '',
	placeholder: '',
	accounts: null,
	close: () => {},
};

export default AccountsMultiDropdown;
