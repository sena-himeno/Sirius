'use client'
import React from 'react';
import type { TodoEvent } from '@/app/interface/todoList';
import {
	Timeline,
	TimelineConnector, TimelineContent,
	TimelineDot,
	TimelineItem,
	TimelineOppositeContent,
	TimelineSeparator
} from '@mui/lab';
import styles from '@/style/todoList.module.css';

export const TimelineComponent: React.FC<{ items: TodoEvent[] }> = ({ items }) => {
	return (
		<div>
			{items === null
				? <p> no thing</p>
				: <Timeline position="alternate">
					{
						items.map((todo, index) => (
							<TimelineItem key={index} className={styles.TimeLineItem}>
								<TimelineOppositeContent className={styles.TimeLineItemTime}>
									{todo.addTime}
								</TimelineOppositeContent>
								<TimelineSeparator>
									<TimelineDot/>
									{index !== items.length - 1 && <TimelineConnector/>}
								</TimelineSeparator>
								<TimelineContent className={styles.TimeLineItemTitle}>{todo.title}</TimelineContent>
							</TimelineItem>
						))}
				</Timeline>
			}
		</div>
	)
}
