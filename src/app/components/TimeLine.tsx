'use server'
import React from 'react';
import { type TodoEvent } from '@/app/interface/todoList';
import { TimelineComponent } from '@/app/todo/components/ClientUI';

const TimeLine: React.FC<{ todoShortItem: TodoEvent[] }> = async ({ todoShortItem }) => {
	return (
		<div className={''}>
			<TimelineComponent items={todoShortItem} />
		</div>
	);
};

export default TimeLine;
