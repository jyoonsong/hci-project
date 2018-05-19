import React, { Component } from 'react';
import PaletteColor from './PaletteColor';
import './Palette.css';

export default class Palette extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.color !== nextProps.color;
	}

	render() {
		console.log("Palette rendered");
		const {colors, changeColor} = this.props;

		const colorList = colors.map(
			color => (
				<PaletteColor color={color} key={color} changeColor={changeColor}/>
			)
		);

		return (
			<div className="color-list">{colorList}</div>
		);
	}
}
