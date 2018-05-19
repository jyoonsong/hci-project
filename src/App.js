import React, { Component } from 'react';
import TodoListTemplate from './components/TodoListTemplate';
import Form from './components/Form';
import TodoItemList from './components/TodoItemList';
import Palette from './components/Palette';

const colors = ['#343a40', '#f03e3e', '#12b886', '#228ae6'];

class App extends Component {

	id = 3 // 이미 0,1,2가 존재
	
	state = {
		input: '',
		todos: [
			{ id: 0, text: ' 리액트 소개', checked: false},
			{ id: 1, text: ' 리액트 소개', checked: true},
			{ id: 2, text: ' 리액트 소개', checked: false},
		],
		color: '#343a40'
	}

	handleChange = (e) => {
		this.setState({
			input: e.target.value // input의 다음 바뀔 값
		});
	}

	handleCreate = () => {
		const {input, todos, color} = this.state;
		this.setState({
			// input 비우고
			input: '', 
			// concat을 이용해 데이터를 배열에 추가
			todos: todos.concat({ 
				id: this.id++, // 데이터 추가될 때마다 id값 올라감
				text: input, // 이건 위에서 state 받아온 const input
				checked: false, // 디폴트는 unchecked
				color // color: color 써도 됨 
			})
		})
	}

	handleKeyPress = (e) => {
		// enter 키일 경우 handleCreate 호출
		if (e.key === 'Enter') {
			this.handleCreate();
		}
	}

	handleToggle = (id) => {
		const {todos} = this.state;
		
		const index = todos.findIndex(todo => todo.id === id); // 파라미터로 받은 id가 같으면 true를 반환하여 몇 번째 아이템을 체크해야하는지 찾는다
		const selected = todos[index]; // 체크해야할 객체
		const nextTodos = [...todos]; // 배열을 복사
		nextTodos[index].checked = !selected.checked;

		// nextTodos[index] = {
		// 	...selected, // 기존의 값 복사하고
		// 	checked: !selected.checked // checked 값만 덮어씌운다
		// };

		this.setState({
			todos: nextTodos
		});
	}

	handleRemove = (id) => {
		const {todos} = this.state;

		this.setState({
			todos: todos.filter(todo => todo.id !== id)
		})
	}

	handleColor = (nextColor) => {
		this.setState({
			color: nextColor
		})
	}

  render() {
  	// this 생략을 위해
  	const {input, todos, color} = this.state;
  	const {handleChange, handleCreate, handleKeyPress, handleToggle, handleRemove, handleColor} = this;


    return (
      <TodoListTemplate 
      	palette={
      		<Palette
      			colors={colors}
      			changeColor={handleColor}
      		/>
      	} 
	      form={
	      	<Form 
	      		value={input}
	      		color={color}
	  				onKeyPress={handleKeyPress}
	  				onChange={handleChange}
	  				onCreate={handleCreate}
					/>
	      }
      >
      	<TodoItemList todos={todos} onToggle={handleToggle} onRemove={handleRemove}/>
      </TodoListTemplate>
    );
  }
}

export default App;
