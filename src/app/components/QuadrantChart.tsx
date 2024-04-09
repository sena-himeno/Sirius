'use client'
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const QuadrantChart: React.FC<{ eventCounts: number[] }> = ({ eventCounts }) => {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current || eventCounts.length !== 4) return;

		const totalEvents = eventCounts.reduce((acc, curr) => acc + curr, 0);
		if (totalEvents === 0) return; // Avoid division by zero

		const importantUrgentSum = eventCounts[0];
		const importantNotUrgentSum = eventCounts[1];
		const unimportantUrgentSum = eventCounts[2];
		const unimportantNotUrgentSum = eventCounts[3];

		const importantRatio = (importantUrgentSum + importantNotUrgentSum) / totalEvents;
		const urgentRatio = (importantUrgentSum + unimportantUrgentSum) / totalEvents;

		const width = 400;
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

		svg.selectAll("*").remove(); // Clear previous content

		svg.append('line')
			.attr('x1', xScale(0.5))
			.attr('y1', margin.top)
			.attr('x2', xScale(0.5))
			.attr('y2', innerHeight + margin.top)
			.attr('stroke', 'black')
			.attr('stroke-width', 1);

		svg.append('text')
			.attr('x', xScale(0.5) + 5)
			.attr('y', margin.top - 5)
			.text('Urgent');

		svg.append('text')
			.attr('x', xScale(0.5) + 5)
			.attr('y', height - 20)
			.text('Not Urgent');

		svg.append('line')
			.attr('x1', margin.left)
			.attr('y1', yScale(0.5))
			.attr('x2', innerWidth + margin.left)
			.attr('y2', yScale(0.5))
			.attr('stroke', 'black')
			.attr('stroke-width', 1);

		svg.append('text')
			.attr('x', width - 75)
			.attr('y', yScale(0.5) - 5)
			.text('Important');

		svg.append('text')
			.attr('x', 20)
			.attr('y', yScale(0.5) - 5)
			.text('Not Important');

		const quadrantCenters = [
			{ x: 0.75, y: 0.75 }, // Upper Right (important and urgent)
			{ x: 0.75, y: 0.25 }, // Lower Right (not important but urgent)
			{ x: 0.25, y: 0.75 }, // Upper Left (important but not urgent)
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
				.text(`${percentage.toFixed(2)}%`);
		});
	}, [eventCounts]);

	return <svg ref={svgRef}></svg>;
};

export default QuadrantChart;
