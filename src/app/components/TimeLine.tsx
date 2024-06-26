import React from 'react';
import { type TodoEvent } from '@/app/interface/todoList';
import { TimelineComponent } from '@/app/todo/components/ClientUI';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
	getDefaultTodoShortContent,
	getTodayTodoShortContent,
	postTodoShortAtServer
} from '@/app/utils/fileContolUseServer';
import { getDate } from '@/app/utils/common';

const TimeLine: React.FC<{ todoShortItem: TodoEvent[] }> = async ({ todoShortItem }) => {
	const useDefaultTodo = true;
	if (useDefaultTodo) {
		const todayTodoShort = await getTodayTodoShortContent(getDate())
		const defaultTodoShort: TodoEvent[] | [] = await getDefaultTodoShortContent(getDate());
		if (todayTodoShort === undefined || todayTodoShort.length <= 0) {
			await postTodoShortAtServer(getDate(), defaultTodoShort);
		}
	}
	return (
		<div className={'text-center'}>
			<TimelineComponent items={todoShortItem} />
		</div>
	);
};

export default TimeLine;
