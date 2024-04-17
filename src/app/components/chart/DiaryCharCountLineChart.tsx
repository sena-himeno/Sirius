'use client'
import React, { useEffect, useRef } from 'react';
// @ts-ignore
import * as d3 from 'd3';

interface DataPoint {
	day: number
	diaryCharCount: number
}

interface Props {
	data: DataPoint[]
}

const DiaryCharCountLineChart: React.FC<Props> = ({ data }) => {
	const svgRef = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		if (svgRef.current == null) return;

		const width = 450;
		const height = 300;
		const margin = { top: 20, right: 20, bottom: 30, left: 50 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const xScale = d3.scaleLinear()
			.domain([1, data.length])
			.range([0, innerWidth]);

		const yScale = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.diaryCharCount) || 0])
			.range([innerHeight, 0]);

		const line = d3.line<DataPoint>()
			.x(d => xScale(d.day))
			.y(d => yScale(d.diaryCharCount));

		const svg = d3.select(svgRef.current);

		svg.selectAll('*').remove();

		svg.attr('width', width)
			.attr('height', height);

		const g = svg.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		g.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${innerHeight})`)
			.call(d3.axisBottom(xScale).ticks(data.length));

		g.append('g')
			.attr('class', 'y-axis')
			.call(d3.axisLeft(yScale));

		g.append('path')
			.datum(data)
			.attr('class', 'line')
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('d', line);
	}, [data]);

	return (
		<svg ref={svgRef}></svg>
	);
}

export default DiaryCharCountLineChart;
