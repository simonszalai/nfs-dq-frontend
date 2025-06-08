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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollContainerRef.current || !data.length)
      return;

    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    const { width: containerWidth, height } = container.getBoundingClientRect();

    // Cancel any ongoing transitions
    d3.select(container).selectAll("*").interrupt();
    d3.select(scrollContainer).selectAll("*").interrupt();

    // Clear previous content
    d3.select(container).selectAll("svg.axis-svg").remove();
    d3.select(scrollContainer).selectAll("svg.chart-svg").remove();
    d3.select("body").selectAll(".field-chart-tooltip").remove();

    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 100, left: 50 };
    const innerHeight = height - margin.top - margin.bottom;
    const barWidth = 50;
    const barPadding = 0.2;
    const totalWidth = data.length * barWidth;

    // Create SVG for fixed y-axis
    const axisSvg = d3
      .select(container)
      .append("svg")
      .attr("class", "axis-svg")
      .attr("width", margin.left)
      .attr("height", height)
      .style("position", "absolute")
      .style("left", 0)
      .style("top", 0)
      .style("z-index", 10);

    // Create SVG for scrollable bars
    const svg = d3
      .select(scrollContainer)
      .append("svg")
      .attr("class", "chart-svg")
      .attr("width", totalWidth + margin.right)
      .attr("height", height);

    const g = svg.append("g").attr("transform", `translate(0,${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, totalWidth])
      .paddingInner(barPadding)
      .paddingOuter(0);

    const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

    // Create color scale
    const colorScale = (value: number) => {
      if (value > 75) return "#10b981"; // emerald-500 (green)
      if (value >= 25) return "#f97316"; // orange-500
      return "#ef4444"; // red-500
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

    // Create tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "field-chart-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "14px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Add bars
    const bars = g
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar-group");

    const rects = bars
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
        tooltip.style(
          "visibility",
          "visible"
        ).html(`<div><strong>${d.name}</strong></div>
                 <div>Population: ${d.value}%</div>
                 <div>Records: ${d.populatedCount.toLocaleString()}</div>
                 ${
                   d.warnings > 0 ? `<div>Warnings: ${d.warnings}</div>` : ""
                 }`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).transition().duration(200).attr("opacity", 1);
        tooltip.style("visibility", "hidden");
      })
      .on("click", (event, d) => {
        if (onFieldClick) onFieldClick(d);
      });

    // Animate bars with proper transition handling
    rects
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => innerHeight - yScale(d.value))
      .on("interrupt", function (d) {
        // If transition is interrupted, immediately set final values
        const datum = d as FieldData;
        d3.select(this)
          .attr("y", yScale(datum.value))
          .attr("height", innerHeight - yScale(datum.value));
      });

    // Add warning indicators (small triangles with text)
    const warningGroup = bars
      .filter((d) => d.warnings > 0)
      .append("g")
      .attr("class", "warning-indicator")
      .attr(
        "transform",
        (d) =>
          `translate(${xScale(d.name)! + xScale.bandwidth() / 2}, ${
            yScale(d.value) - 12
          })`
      )
      .style("opacity", 0)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        // Show tooltip on hover
        tooltip.style(
          "visibility",
          "visible"
        ).html(`<div><strong>${d.name}</strong></div>
                 <div>${d.warnings} warning${d.warnings > 1 ? "s" : ""}</div>`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("visibility", "hidden");
      })
      .on("click", function (event, d) {
        event.stopPropagation(); // Prevent event bubbling
        if (onFieldClick) onFieldClick(d);
      });

    // Add small triangle
    warningGroup
      .append("path")
      .attr("d", "M 0,-6 L -5,3 L 5,3 Z") // Small triangle pointing up
      .attr("fill", "#dc2626");

    // Add warning text
    warningGroup
      .append("text")
      .attr("x", 10)
      .attr("y", 0)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#dc2626")
      .attr("font-size", "11px")
      .attr("font-weight", "700")
      .text((d) => d.warnings);

    // Animate warning indicators
    warningGroup
      .transition()
      .duration(300)
      .delay((d, i) => i * 50 + 1000)
      .style("opacity", 1);

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
      .attr("font-size", "12px")
      .text((d) => {
        const label = String(d);
        return label.length > 15 ? label.substring(0, 15) + "..." : label;
      });

    xAxis.select(".domain").remove();
    xAxis.selectAll(".tick line").remove();

    // Add y axis to the fixed axis SVG
    const yAxis = axisSvg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => `${d}%`)
      );

    yAxis.selectAll("text").attr("fill", "#9ca3af").attr("font-size", "12px");

    yAxis.select(".domain").remove();

    // Add horizontal grid lines to the axis SVG for the visible area
    axisSvg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll(".axis-grid-line")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "axis-grid-line")
      .attr("x1", 0)
      .attr("x2", containerWidth - margin.left)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#374151")
      .attr("stroke-dasharray", "2,2")
      .attr("opacity", 0.3);

    // Add grid lines
    g.selectAll(".grid-line")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", totalWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#374151")
      .attr("stroke-dasharray", "2,2")
      .attr("opacity", 0.3);

    // Cleanup
    return () => {
      // Cancel any ongoing transitions before cleanup
      d3.select(container).selectAll("*").interrupt();
      d3.select(scrollContainer).selectAll("*").interrupt();

      d3.select(container).selectAll("svg.axis-svg").remove();
      d3.select(scrollContainer).selectAll("svg.chart-svg").remove();
      d3.select("body").selectAll(".field-chart-tooltip").remove();
    };
  }, [data, onFieldClick]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div
        ref={scrollContainerRef}
        className="absolute top-0 bottom-0 right-0 overflow-x-auto overflow-y-hidden"
        style={{ left: "50px" }}
      />
    </div>
  );
}
