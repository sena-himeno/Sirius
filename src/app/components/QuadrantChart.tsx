'use client'
import React, { useEffect, useRef } from 'react';
// @ts-ignore
import * as d3 from 'd3';

const QuadrantChart: React.FC<{ eventCounts: number[] }> = ({ eventCounts }) => {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if ((svgRef.current == null) || eventCounts.length !== 4) return;
		const totalEvents = eventCounts.reduce((acc, curr) => acc + curr, 0);
		if (totalEvents === 0) return;
		const width = 450;
		const height = 300;
		const margin = { top: 20, right: 20, bottom: 40, left: 40 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const xScale = d3.scaleLinear()
			.domain([0, 1])
			.range([margin.left, innerWidth + margin.left]);

		const yScale = d3.scaleLinear()
			.domain([0, 1])
			.range([innerHeight + margin.top, margin.top]);

		const svg = d3.select(svgRef.current)
			.attr('width', width)
			.attr('height', height);

		svg.selectAll('*').remove(); // Clear previous content

		svg.append('defs').append('marker')
			.attr('id', 'arrow')
			.attr('markerWidth', 10)
			.attr('markerHeight', 10)
			.attr('refX', 8)
			.attr('refY', 3)
			.attr('orient', 'auto')
			.append('path')
			.attr('d', 'M0,0 L0,6 L9,3 z')
			.attr('fill', 'var(--title-color)');
		const lines = [
			{ x1: 0.5, y1: 0, x2: 0.5, y2: 1 }, // Vertical line for Urgent/Not Urgent
			{ x1: 0, y1: 0.5, x2: 1, y2: 0.5 }, // Horizontal line for Important/Not Important
			{ x1: 0.5, y1: 1, x2: 0.5, y2: 0 }, // Reverse vertical line for bottom
			{ x1: 1, y1: 0.5, x2: 0, y2: 0.5 } // Reverse horizontal line for left
		];
		lines.forEach(line => {
			svg.append('line')
				.attr('x1', xScale(line.x1))
				.attr('y1', yScale(line.y1))
				.attr('x2', xScale(line.x2))
				.attr('y2', yScale(line.y2))
				.attr('stroke', 'var(--title-color)')
				.attr('stroke-width', 1)
				.attr('marker-end', 'url(#arrow)');
		});
		// Add text labels
		svg.append('text')
			.attr('x', xScale(0.5) + 5)
			.attr('y', margin.top + 10)
			.style('fill', 'var(--title-color)')
			.text('Urgent');

		svg.append('text')
			.attr('x', xScale(0.5) + 5)
			.attr('y', height - 40)
			.style('fill', 'var(--title-color)')
			.text('Not Urgent');

		svg.append('text')
			.attr('x', width - 75)
			.attr('y', yScale(0.5) - 5)
			.style('fill', 'var(--title-color)')
			.text('Important');

		svg.append('text')
			.attr('x', 20)
			.attr('y', yScale(0.5) - 5)
			.style('fill', 'var(--title-color)')
			.text('Not Important');

		const quadrantCenters = [
			{ x: 0.75, y: 0.75 }, // Upper Right (important and urgent)
			{ x: 0.75, y: 0.25 }, // Lower Right (important but not urgent)
			{ x: 0.25, y: 0.75 }, // Upper Left (not important but urgent)
			{ x: 0.25, y: 0.25 } // Lower Left (not important and not urgent)
		];

		quadrantCenters.forEach((center, index) => {
			const ratio = eventCounts[index] / totalEvents;
			const percentage = ratio * 100;

			svg.append('text')
				.attr('x', xScale(center.x))
				.attr('y', yScale(center.y))
				.attr('dy', '0.35em')
				.attr('text-anchor', 'middle')
				.style('fill', 'var(--other-title-color)')
				.text(`${percentage.toFixed(2)}%`);
		});
	}, [eventCounts]);

	return <svg ref={svgRef}></svg>;
};

export default QuadrantChart;
