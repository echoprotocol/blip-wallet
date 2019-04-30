import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import {
	KEY_CODE_TAB,
	KEY_CODE_ARROW_DOWN,
	KEY_CODE_ARROW_UP,
} from '../../constants/global-constants';

class TransactionMultiDropdown extends React.Component {

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

	onItemToggle(e, key) {
		e.preventDefault();
		this.props.toggle(key);
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
		const { opened, focus } = this.state;
		const {
			label, info, placeholder, types,
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

							onClick={() => this.toggleDropdown()}
							variant="Info"
						>
							{!!info && (<span className="dropdown-toggle-text">{info}</span>)}
							<span className="carret" />
						</Dropdown.Toggle>

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
									types && types.size ? types.map((item, i) => (
										<div className="checkbox" key={item.get('type')}>
											<input
												ref={(ref) => { this.refList[i] = ref; }}
												tabIndex={0}
												onKeyPress={(e) => this.onItemToggle(e, i)}
												onChange={() => {}}
												onKeyDown={(e) => this.onKeyDown(e, i)}
												type="checkbox"
												name="multi-select"
												id={`tr-${item.get('type')}`}
												checked={item.get('selected')}
											/>

											<label htmlFor={`tr-${item.get('type')}`} onClick={(e) => this.onItemToggle(e, i)}>
												<span className="label-text">
													<FormattedMessage id={item.get('name')} />
												</span>
											</label>
										</div>
									)) : (<div>No Results</div>)
								}
							</PerfectScrollbar>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</div>
		);
	}

}

TransactionMultiDropdown.propTypes = {
	label: PropTypes.string,
	info: PropTypes.string,
	placeholder: PropTypes.string,
	types: PropTypes.object,
	toggle: PropTypes.func.isRequired,
	search: PropTypes.func.isRequired,
};

TransactionMultiDropdown.defaultProps = {
	label: '',
	info: '',
	placeholder: '',
	types: null,
};

export default TransactionMultiDropdown;
