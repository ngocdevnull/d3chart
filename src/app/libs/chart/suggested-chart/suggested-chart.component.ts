import { Component, Input, OnInit, signal } from '@angular/core';
import * as d3 from 'd3';

import { ColorChart, SuggestedChart } from '../../interfaces';

@Component({
  selector: 'app-suggested-chart',
  standalone: true,
  imports: [],
  templateUrl: './suggested-chart.component.html',
  styleUrl: './suggested-chart.component.css'
})
export class SuggestedChartComponent implements OnInit {
  @Input() suggestedData: SuggestedChart = {
    data1: [
      {
        x: 1,
        y: 0.03
      },
      {
        x: 2,
        y: 0.04
      },
      {
        x: 3,
        y: 0.06
      },
      {
        x: 70,
        y: 0.06
      },
      {
        x: 80,
        y: 4
      },
      {
        x: 100,
        y: 2
      }
    ],
    data2: [
      { group: 'A', value: 4 },
      { group: 'B', value: 16 },
      { group: 'C', value: 32 },
      { group: 'D', value: 44 },
      { group: 'E', value: 123 },
      { group: 'F', value: 22 },
      { group: 'G', value: 33 },
      { group: 'H', value: 11 }
    ]
  };
  @Input()
  maxRange: number = 100;
  @Input()
  color: ColorChart = {
    colorChart: 'steelblue',
    colorChart2: '#FDDA0D'
  };

  x1Scale!: d3.ScaleLinear<number, number>;
  y1Scale!: d3.ScaleLinear<number, number>;
  x2Scale!: d3.ScaleBand<string>;
  y2Scale!: d3.ScaleLinear<number, number>;
  yMax!: number;

  #svg!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  #margin = { top: 30, right: 30, bottom: 70, left: 60 };

  fullWidth = signal<number>(460);
  fullHeight = signal<number>(400);
  width = signal<number>(this.fullWidth() - this.#margin.top - this.#margin.bottom);
  height = signal<number>(this.fullHeight() - this.#margin.top - this.#margin.bottom);

  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {
    this.#initializeXYAxes();
    this.#initializeFrameChart();
    this.#handleXAxe();
    this.#handleYAxe();
    this.#displayData2InChart();
    this.#displayDataInChart();
  }

  #initializeXYAxes(): void {
    this.yMax = d3.max(this.suggestedData.data2.map(d => d.value)) || 0;

    this.x1Scale = d3.scaleLinear().domain([1, this.maxRange]).range([0, this.width()]);
    this.y1Scale = d3.scaleLinear().domain([0, 13]).range([this.height(), 0]);

    this.x2Scale = d3
      .scaleBand()
      .range([0, this.width()])
      .domain(this.suggestedData.data2.map(d => d.group))
      .padding(0.2);
    this.y2Scale = d3.scaleLinear().domain([0, this.yMax]).range([this.height(), 0]);
  }

  #initializeFrameChart(): void {
    this.#svg = d3
      .select('#suggested-chart')
      .append('svg')
      .attr('width', this.width() + this.#margin.left + this.#margin.right)
      .attr('height', this.height() + this.#margin.top + this.#margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.#margin.left + ',' + this.#margin.top + ')');
  }

  #handleXAxe(): void {
    this.#svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height() + ')')
      .call(d3.axisBottom(this.x1Scale).tickSize(0));
  }

  #handleYAxe(): void {
    this.#svg.append('g').call(d3.axisLeft(this.y1Scale).tickSize(0));
  }

  #displayData2InChart(): void {
    this.#svg
      .selectAll('rect')
      .data(this.suggestedData.data2)
      .enter()
      .append('rect')
      .attr('x', d => Number(this.x2Scale(d.group)))
      .attr('y', d => this.y2Scale(d.value))
      .attr('width', this.x2Scale.bandwidth())
      .attr('height', d => this.height() - this.y2Scale(d.value))
      .attr('fill', this.color.colorChart);
  }

  #displayDataInChart(): void {
    this.#svg
      .append('path')
      .datum(this.suggestedData.data1)
      .attr('fill', 'none')
      .attr('stroke', this.color.colorChart2)
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line<{ x: number; y: number }>()
          .x(d => this.x1Scale(d.x))
          .y(d => this.y1Scale(d.y))
      );
  }
}
