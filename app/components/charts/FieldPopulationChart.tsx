import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface FieldData {
  name: string;
  value: number;
  populatedCount: number;
  warnings: number;
}

interface FieldPopulationChartProps {
  data: FieldData[];
  onFieldClick?: (field: FieldData) => void;
}

export function FieldPopulationChart({
  data,
  onFieldClick,
}: FieldPopulationChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    // Clear previous content
    d3.select(container).selectAll("*").remove();

    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 100, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

    // Create color scale
    const colorScale = (value: number) => {
      if (value === 0) return "#6b7280"; // gray-500
      if (value < 25) return "#ef4444"; // red-500
      if (value < 70) return "#f97316"; // orange-500
      return "#10b981"; // emerald-500
    };

    // Create gradient definitions
    const defs = svg.append("defs");

    data.forEach((d, i) => {
      const gradient = defs
        .append("linearGradient")
        .attr("id", `gradient-${i}`)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

      const color = colorScale(d.value);
      gradient
        .append("stop")
        .attr("offset", "0%")
        .style("stop-color", color)
        .style("stop-opacity", 0.8);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .style("stop-color", color)
        .style("stop-opacity", 0.4);
    });

    // Add bars
    const bars = g
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar-group");

    bars
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name)!)
      .attr("y", innerHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", (d, i) => `url(#gradient-${i})`)
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(200).attr("opacity", 0.8);
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).transition().duration(200).attr("opacity", 1);
      })
      .on("click", (event, d) => {
        if (onFieldClick) onFieldClick(d);
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => innerHeight - yScale(d.value));

    // Add value labels
    bars
      .append("text")
      .attr("class", "value-label")
      .attr("x", (d) => xScale(d.name)! + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.value) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("opacity", 0)
      .text((d) => `${d.value}%`)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50 + 500)
      .attr("opacity", 1);

    // Add x axis
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    xAxis
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .attr("fill", "#9ca3af")
      .attr("font-size", "12px");

    xAxis.select(".domain").remove();
    xAxis.selectAll(".tick line").remove();

    // Add y axis
    const yAxis = g.append("g").call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat((d) => `${d}%`)
    );

    yAxis.selectAll("text").attr("fill", "#9ca3af").attr("font-size", "12px");

    yAxis.select(".domain").remove();
    yAxis
      .selectAll(".tick line")
      .attr("stroke", "#374151")
      .attr("stroke-dasharray", "2,2");

    // Add grid lines
    g.selectAll(".grid-line")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#374151")
      .attr("stroke-dasharray", "2,2")
      .attr("opacity", 0.3);

    // Cleanup
    return () => {
      d3.select(container).selectAll("*").remove();
    };
  }, [data, onFieldClick]);

  return <div ref={containerRef} className="w-full h-full" />;
}
