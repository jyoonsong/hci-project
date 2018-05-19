import React, { Component } from 'react';
import './TodoItem.css';

export default class TodoItem extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.checked !== nextProps.checked;
	}

	render() {
		const { text, checked, color, id, onToggle, onRemove } = this.props;

		return (
			<div className="todo-item" onClick={() => onToggle(id)} style={{color: color}}>
				<div className="remove" onClick={(e) => {
					e.stopPropagation(); // onToggle이 실행되지 않도록 함
					onRemove(id);
				}}>&times;</div>
				<div className={`todo-text ${checked ? ' checked' : ''}`}>
					<div>{text}</div>
				</div>
				{
					checked && (<div className="check-mark">&#x2713;</div>)
				}
			</div>
		);
	}
}
