'use client'
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/style/home.module.css';
// @ts-expect-error
import * as d3 from 'd3';
import { type MonthlyStats } from '@/app/interface/todoList';

interface LollipopChartProps {
	data: MonthlyStats[]
	width: number
	height: number
	type: 'add' | 'done'
}

const LollipopChart: React.FC<LollipopChartProps> = ({ data, width, height, type }) => {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!data) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove();
		const margin = { top: 20, right: 30, bottom: 30, left: 40 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const filteredData = type === 'add' ? data.map(d => ({ month: d.month, value: d.addedTasks })) : data.map(d => ({ month: d.month, value: d.doneTasks }));

		const xScale = d3.scaleBand()
			.domain(filteredData.map(d => d.month))
			.range([0, innerWidth])
			.padding(0.1);

		const yScale = d3.scaleLinear()
			.domain([0, d3.max(filteredData, d => d.value) || 0])
			.nice()
			.range([innerHeight, 0]);

		const g = svg.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const lines = g.selectAll('.line')
			.data(filteredData)
			.enter().append('line')
			.attr('class', type === 'add' ? 'added-line' : 'done-line')
			.attr('x1', (d: { month: any }) => xScale(d.month) + xScale.bandwidth() / 2)
			.attr('y1', d => yScale(0))
			.attr('x2', (d: { month: any }) => xScale(d.month) + xScale.bandwidth() / 2)
			.attr('y2', d => yScale(0))
			.attr('stroke', type === 'add' ? 'steelblue' : 'red')
			.attr('stroke-width', 2);

		const circles = g.selectAll('.circle')
			.data(filteredData)
			.enter().append('circle')
			.attr('class', type === 'add' ? 'added-circle' : 'done-circle')
			.attr('cx', d => xScale(d.month) + xScale.bandwidth() / 2)
			.attr('cy', d => yScale(0))
			.attr('r', 5)
			.style('fill', type === 'add' ? 'steelblue' : 'red');

		circles.transition()
			.duration(1000)
			.delay((d, i) => i * 100)
			.attr('cy', d => yScale(d.value));

		lines.transition()
			.duration(1000)
			.delay((d, i) => i * 100)
			.attr('y2', d => yScale(d.value));

		const xAxis = d3.axisBottom(xScale);
		g.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${innerHeight})`)
			.call(xAxis);

		const yAxis = d3.axisLeft(yScale);
		g.append('g')
			.attr('class', 'y-axis')
			.call(yAxis);
	}, [data, width, height, type]);

	return (
		<svg ref={svgRef} width={width} height={height}></svg>
	);
};

interface TodoLollipopProps {
	todoLineChartDate: MonthlyStats[]
}

export const TodoLollipop: React.FC<TodoLollipopProps> = ({ todoLineChartDate }) => {
	const [chartType, setChartType] = useState<'add' | 'done'>('done');

	const handleChartTypeChange = (type: 'add' | 'done'): void => {
		setChartType(type);
	};

	return (
		<div>
			<div>
				<button className={`${styles.chartButtonChoose} ${chartType === 'done' ? styles.selectedButton : ''}`} onClick={() => { handleChartTypeChange('done'); }}>Done Tasks</button>
				<button className={`${styles.chartButtonChoose} ${chartType === 'add' ? styles.selectedButton : ''}`} onClick={() => { handleChartTypeChange('add'); }}>Added Tasks</button>
			</div>
			<div>
				<LollipopChart data={todoLineChartDate} type={chartType} width={700} height={300} />
			</div>
		</div>
	);
};
