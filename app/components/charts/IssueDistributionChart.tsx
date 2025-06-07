import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface IssueData {
  label: string;
  value: number;
  color: string;
}

interface IssueDistributionChartProps {
  data: IssueData[];
  centerText?: string;
  centerSubtext?: string;
}

export function IssueDistributionChart({
  data,
  centerText,
  centerSubtext,
}: IssueDistributionChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    // Clear previous content
    d3.select(container).selectAll("*").remove();

    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6;
    const outerRadius = radius * 0.9;

    // Create SVG
    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create pie generator
    const pie = d3
      .pie<IssueData>()
      .value((d) => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<IssueData>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(4);

    // Create hover arc
    const hoverArc = d3
      .arc<d3.PieArcDatum<IssueData>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius + 10)
      .cornerRadius(4);

    // Create gradient definitions
    const defs = svg.append("defs");

    data.forEach((d, i) => {
      const gradient = defs
        .append("radialGradient")
        .attr("id", `donut-gradient-${i}`)
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .style("stop-color", d.color)
        .style("stop-opacity", 0.8);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .style("stop-color", d.color)
        .style("stop-opacity", 1);
    });

    // Add shadow filter
    const filter = defs
      .append("filter")
      .attr("id", "donut-shadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter
      .append("feDropShadow")
      .attr("dx", 0)
      .attr("dy", 4)
      .attr("stdDeviation", 4)
      .attr("flood-color", "#000000")
      .attr("flood-opacity", 0.2);

    // Draw arcs
    const arcs = g
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => `url(#donut-gradient-${i})`)
      .attr("filter", "url(#donut-shadow)")
      .style("cursor", "pointer")
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("opacity", 1)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t))!;
        };
      });

    // Add hover effects
    arcs
      .selectAll("path")
      .on("mouseenter", function (this: any, event: any, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", hoverArc as any);

        // Show tooltip
        const percentage = (
          (d.data.value / d3.sum(data, (d) => d.value)) *
          100
        ).toFixed(1);

        g.append("text")
          .attr("class", "hover-label")
          .attr("text-anchor", "middle")
          .attr("y", -5)
          .style("font-size", "24px")
          .style("font-weight", "bold")
          .style("fill", "white")
          .text(`${percentage}%`);

        g.append("text")
          .attr("class", "hover-label")
          .attr("text-anchor", "middle")
          .attr("y", 20)
          .style("font-size", "14px")
          .style("fill", "#9ca3af")
          .text(d.data.label);
      })
      .on("mouseleave", function (this: any, event: any, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arc as any);

        g.selectAll(".hover-label").remove();

        // Restore center text if provided
        if (centerText) {
          g.append("text")
            .attr("class", "center-text")
            .attr("text-anchor", "middle")
            .attr("y", -5)
            .style("font-size", "32px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .text(centerText);
        }

        if (centerSubtext) {
          g.append("text")
            .attr("class", "center-subtext")
            .attr("text-anchor", "middle")
            .attr("y", 20)
            .style("font-size", "14px")
            .style("fill", "#9ca3af")
            .text(centerSubtext);
        }
      });

    // Add center text if provided
    if (centerText) {
      g.append("text")
        .attr("class", "center-text")
        .attr("text-anchor", "middle")
        .attr("y", -5)
        .style("font-size", "32px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .attr("opacity", 0)
        .text(centerText)
        .transition()
        .duration(1000)
        .delay(data.length * 100)
        .attr("opacity", 1);
    }

    if (centerSubtext) {
      g.append("text")
        .attr("class", "center-subtext")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .style("font-size", "14px")
        .style("fill", "#9ca3af")
        .attr("opacity", 0)
        .text(centerSubtext)
        .transition()
        .duration(1000)
        .delay(data.length * 100 + 200)
        .attr("opacity", 1);
    }

    // Cleanup
    return () => {
      d3.select(container).selectAll("*").remove();
    };
  }, [data, centerText, centerSubtext]);

  return <div ref={containerRef} className="w-full h-full" />;
}
