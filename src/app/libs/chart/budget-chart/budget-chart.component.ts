import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

import { BudgetChartData, Subgroup } from '../../interfaces';

@Component({
  selector: 'app-budget-chart',
  standalone: true,
  imports: [],
  templateUrl: './budget-chart.component.html',
  styleUrl: './budget-chart.component.css'
})
export class BudgetChartComponent implements OnInit {
  @Input() listColors: string[] = ['#e41a1c', '#377eb8', '#4daf4a', '#4dbfdb', '#4dcf4c'];
  @Input() subgroups: Subgroup[] = ['nitrogen', 'normal', 'stress', 'hard', 'easy', 'diff', 'so', 'then'];
  @Input() data: BudgetChartData[] = [
    {
      nitrogen: '12',
      group: 'banana',
      normal: '1',
      stress: '13',
      hard: '19',
      easy: '10',
      diff: '50',
      so: '40',
      then: '80'
    },
    {
      nitrogen: '6',
      group: 'poacee',
      normal: '6',
      stress: '33',
      hard: '19',
      easy: '10',
      diff: '50',
      so: '40',
      then: '90'
    },
    {
      nitrogen: '11',
      group: 'sorgho',
      normal: '28',
      stress: '12',
      hard: '19',
      easy: '10',
      diff: '50',
      so: '40',
      then: '70'
    },
    {
      nitrogen: '19',
      group: 'triticum',
      normal: '6',
      stress: '1',
      hard: '19',
      easy: '10',
      diff: '50',
      so: '40',
      then: '100'
    }
  ];

  #svg!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  #xScale!: d3.ScaleBand<string>;
  #yScale!: d3.ScaleLinear<number, number>;
  #color!: d3.ScaleOrdinal<string, string>;
  #xSubgroup!: d3.ScaleBand<string>;
  #margin = { top: 10, right: 30, bottom: 20, left: 50 };
  #width = 460 - this.#margin.left - this.#margin.right;
  #height = 400 - this.#margin.top - this.#margin.bottom;

  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {
    this.#color = d3.scaleOrdinal<string>().domain(this.subgroups).range(this.listColors);
    this.#initializeXYAxes();
    this.#xSubgroup = d3.scaleBand().domain(this.subgroups).range([0, this.#xScale.bandwidth()]).padding(0.05);
    this.#initializeFrameChart();
    this.#handleXAxe();
    this.#handleYAxe();
    this.#displayDataInChart();
  }

  #initializeXYAxes(): void {
    const groups = d3.map(this.data, d => d['group']);

    this.#xScale = d3.scaleBand().domain(groups).range([0, this.#width]).padding(0.2);
    this.#yScale = d3.scaleLinear().domain([0, 100]).range([this.#height, 0]);
  }

  #initializeFrameChart(): void {
    this.#svg = d3
      .select('#budget-chart')
      .append('svg')
      .attr('width', this.#width + this.#margin.left + this.#margin.right)
      .attr('height', this.#height + this.#margin.top + this.#margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.#margin.left}, ${this.#margin.top})`);
  }

  #handleXAxe(): void {
    this.#svg
      .append('g')
      .attr('transform', 'translate(0,' + this.#height + ')')
      .call(d3.axisBottom(this.#xScale).tickSize(0));
  }

  #handleYAxe(): void {
    this.#svg.append('g').call(d3.axisLeft(this.#yScale).tickSize(0));
  }

  #displayDataInChart(): void {
    this.#svg
      .append('g')
      .selectAll('g')
      .data(this.data)
      .enter()
      .append('g')
      .attr('transform', d => 'translate(' + this.#xScale(d['group']) + ',0)')
      .selectAll('rect')
      .data(d => this.subgroups.map(key => ({ key: key, value: d[key] })))
      .enter()
      .append('rect')
      .attr('x', d => String(this.#xSubgroup(d.key)))
      .attr('y', d => this.#yScale(Number(d.value)))
      .attr('width', this.#xSubgroup.bandwidth())
      .attr('height', d => this.#height - this.#yScale(Number(d.value)))
      .attr('fill', d => this.#color(d['key']));
  }
}
