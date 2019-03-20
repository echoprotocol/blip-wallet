/* eslint-disable react/prop-types */ // TODO::
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

export default class Home extends Component {

	render() {
		return (
			<div className={styles.container} data-tid="container">
				<h2>Blip Wallet</h2>
				<Link to={routes.COUNTER}>to Counter</Link>
			</div>
		);
	}

}
