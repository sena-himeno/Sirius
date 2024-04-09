'use server'
import React from 'react';
import { type TodoEvent } from '@/app/interface/todoList';
import { TimelineComponent } from '@/app/todo/components/ClientUI';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const TimeLine: React.FC<{ todoShortItem: TodoEvent[] }> = async ({ todoShortItem }) => {
	return (
		<div className={'text-center'}>
			<TimelineComponent items={todoShortItem} />
		</div>
	);
};

export default TimeLine;
