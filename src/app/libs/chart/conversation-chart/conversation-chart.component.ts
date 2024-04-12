import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ConversationChart } from '../../interfaces';

@Component({
  selector: 'app-conversation-chart',
  standalone: true,
  imports: [],
  templateUrl: './conversation-chart.component.html',
  styleUrl: './conversation-chart.component.css'
})
export class ConversationChartComponent implements OnInit {
  @Input() data: ConversationChart[] = [
    {
      country: 'United States',
      value: '100'
    },
    {
      country: 'Russia',
      value: '30'
    },
    {
      country: 'Germany (FRG)',
      value: '40'
    },
    {
      country: 'France',
      value: '10'
    },
    {
      country: 'United Kingdom',
      value: '70'
    },
    {
      country: 'China',
      value: '50'
    },
    {
      country: 'Spain',
      value: '81'
    },
    {
      country: 'Netherlands',
      value: '11'
    },
    {
      country: 'Italy',
      value: '66'
    },
    {
      country: 'Israel',
      value: '12'
    }
  ];
  @Input() color: string = 'steelblue';
  @Input() maxRange: number = 100;

  #svg!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  #xScale!: d3.ScaleLinear<number, number>;
  #yScale!: d3.ScaleBand<string>;
  #margin = { top: 20, right: 10, bottom: 40, left: 100 };
  #width = 460 - this.#margin.left - this.#margin.right;
  #height = 400 - this.#margin.top - this.#margin.bottom;

  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {
    this.#initializeXYAxes();
    this.#initializeFrameChart();
    this.#initializeXAxe();
    this.#initializeYAxe();
    this.#displayDataInChart();
  }

  #initializeXYAxes(): void {
    this.#xScale = d3.scaleLinear().domain([0, this.maxRange]).range([0, this.#width]);
    this.#yScale = d3
      .scaleBand()
      .range([0, this.#height])
      .domain(this.data.map(d => d['country']))
      .padding(0.2);
  }

  #initializeFrameChart(): void {
    this.#svg = d3
      .select('#conversation-chart')
      .append('svg')
      .attr('width', this.#width + this.#margin.left + this.#margin.right)
      .attr('height', this.#height + this.#margin.top + this.#margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.#margin.left}, ${this.#margin.top})`);
  }

  #displayDataInChart(): void {
    this.#svg
      .selectAll('rect')
      .data(this.data)
      .join('rect')
      .attr('x', this.#xScale(0))
      .attr('y', d => Number(this.#yScale(d.country)))
      .attr('width', d => this.#xScale(Number(d.value)))
      .attr('height', this.#yScale.bandwidth())
      .attr('fill', this.color);
  }

  #initializeXAxe(): void {
    this.#svg.append('g').attr('transform', `translate(0, ${this.#height})`).call(d3.axisBottom(this.#xScale).tickSize(0));
  }

  #initializeYAxe(): void {
    this.#svg.append('g').call(d3.axisLeft(this.#yScale).tickSize(0));
  }
}
