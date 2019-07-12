import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import classnames from 'classnames';
import {
	KEY_CODE_TAB,
	KEY_CODE_ARROW_DOWN,
	KEY_CODE_ARROW_UP,
} from '../../constants/global-constants';
import { ASSET_TYPE } from '../../constants/transaction-constants';

class MultiDropdown extends React.Component {

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

		if (this.searchInput && opened !== prevOpened) {
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

	onKeyDown(e, index, row) {
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
					this.props.close();

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

	onItemToggle(e, coin) {
		e.preventDefault();
		this.props.toggle(coin);
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

	renderElement(coin, index, i) {
		const id = coin.get('type') === ASSET_TYPE ? coin.getIn(['asset', 'id']) : coin.getIn(['contract', 'id']);
		const symbol = coin.get('type') === ASSET_TYPE ? coin.getIn(['asset', 'symbol']) : coin.getIn(['contract', 'token', 'symbol']);

		return (
			<div className="checkbox" key={id}>
				<input
					ref={(ref) => {
						if (ref) {
							if (!this.refList[index]) {
								this.refList[index] = [];
							}
							this.refList[index][i] = ref;
						}
					}}
					tabIndex={0}
					onKeyDown={(e) => this.onKeyDown(e, index, i)}
					onKeyPress={(e) => this.onItemToggle(e, coin)}
					onChange={() => {}}
					type="checkbox"
					name="multi-select"
					id={`id-${id}`}
					checked={coin.get('selected')}
				/>

				<label htmlFor={`id-${id}`} onClick={(e) => this.onItemToggle(e, coin)}>
					<span className="label-text">
						{symbol}
					</span>
				</label>
			</div>
		);
	}

	render() {
		const { opened, focus } = this.state;
		const {
			label, info, placeholder, coins,
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
									coins && coins.length ? coins.map((elem, index) => (
										elem.list.size ? (
											<div className={elem.title.toLowerCase()} key={elem.title}>
												<div className="title">{elem.title}</div>
												{
													elem.list.map((c, i) => this.renderElement(c, index, i))
												}
											</div>
										) : null
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

MultiDropdown.propTypes = {
	label: PropTypes.string,
	info: PropTypes.string,
	placeholder: PropTypes.string,
	coins: PropTypes.array,
	toggle: PropTypes.func.isRequired,
	search: PropTypes.func.isRequired,
	close: PropTypes.func,
};

MultiDropdown.defaultProps = {
	label: '',
	info: '',
	placeholder: '',
	coins: null,
	close: () => {},
};

export default MultiDropdown;
