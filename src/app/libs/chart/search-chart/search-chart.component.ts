import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ColorChart, SearchChart } from '../../interfaces';

@Component({
  selector: 'app-search-chart',
  standalone: true,
  imports: [],
  templateUrl: './search-chart.component.html',
  styleUrl: './search-chart.component.css'
})
export class SearchChartComponent implements OnInit {
  @Input() searchData: SearchChart = {
    data: [
      {
        Country: 'United States',
        Value: '100'
      },
      {
        Country: 'Russia',
        Value: '30'
      },
      {
        Country: 'Germany (FRG)',
        Value: '40'
      },
      {
        Country: 'France',
        Value: '10'
      },
      {
        Country: 'United Kingdom',
        Value: '70'
      },
      {
        Country: 'China',
        Value: '50'
      },
      {
        Country: 'Spain',
        Value: '81'
      },
      {
        Country: 'Netherlands',
        Value: '11'
      },
      {
        Country: 'Italy',
        Value: '66'
      },
      {
        Country: 'Israel',
        Value: '12'
      }
    ],
    data2: [
      {
        Country: 'United States',
        Value: '10'
      },
      {
        Country: 'Russia',
        Value: '20'
      },
      {
        Country: 'Germany (FRG)',
        Value: '30'
      },
      {
        Country: 'France',
        Value: '40'
      },
      {
        Country: 'United Kingdom',
        Value: '50'
      },
      {
        Country: 'China',
        Value: '60'
      },
      {
        Country: 'Spain',
        Value: '70'
      },
      {
        Country: 'Netherlands',
        Value: '80'
      },
      {
        Country: 'Italy',
        Value: '90'
      },
      {
        Country: 'Israel',
        Value: '100'
      }
    ]
  };
  @Input() color: ColorChart = {
    colorChart: 'steelblue',
    colorChart2: '#FDDA0D'
  };
  @Input() maxRange: number = 100;

  #svg!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  #xScale!: d3.ScaleLinear<number, number>;
  #yScale!: d3.ScaleBand<string>;
  #margin = { top: 20, right: 10, bottom: 50, left: 100 };
  #width = 460 - this.#margin.left - this.#margin.right;
  #height = 400 - this.#margin.top - this.#margin.bottom;
  #space = 3;

  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {
    this.#initializeXYAxes();
    this.#initializeFrameChart();
    this.#handleXAxe();
    this.#handleYAxe();
    this.#displayDataInChart();
    this.#displayData2InChart();
  }

  #initializeXYAxes(): void {
    const mergedData = [...this.searchData.data, ...this.searchData.data2];

    this.#xScale = d3.scaleLinear().domain([0, this.maxRange]).range([0, this.#width]);
    this.#yScale = d3
      .scaleBand()
      .range([0, this.#height])
      .domain(mergedData.map(d => d['Country']))
      .padding(0.4);
  }

  #initializeFrameChart(): void {
    this.#svg = d3
      .select('#search-chart')
      .append('svg')
      .attr('width', this.#width + this.#margin.left + this.#margin.right)
      .attr('height', this.#height + this.#margin.top + this.#margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.#margin.left}, ${this.#margin.top})`);
  }

  #handleXAxe(): void {
    this.#svg
      .append('g')
      .attr('transform', `translate(0, ${this.#height})`)
      .call(d3.axisBottom(this.#xScale).tickSize(0))
      .selectAll('text');
  }

  #handleYAxe(): void {
    this.#svg.append('g').call(d3.axisLeft(this.#yScale).tickSize(0));
  }

  #displayDataInChart(): void {
    this.#svg
      .selectAll('.rect1')
      .data(this.searchData.data)
      .enter()
      .append('rect')
      .attr('x', this.#xScale(0.3))
      .attr('y', d => Number(this.#yScale(d.Country)) - this.#space / 2)
      .attr('width', d => this.#xScale(Number(d.Value)))
      .attr('height', this.#yScale.bandwidth() / 2)
      .attr('fill', this.color.colorChart);
  }

  #displayData2InChart(): void {
    this.#svg
      .selectAll('.rect2')
      .data(this.searchData.data2)
      .enter()
      .append('rect')
      .attr('x', this.#xScale(0.3))
      .attr('y', d => Number(this.#yScale(d.Country)) + this.#yScale.bandwidth() / 2 + this.#space / 2)
      .attr('width', d => this.#xScale(Number(d.Value)))
      .attr('height', this.#yScale.bandwidth() / 2)
      .attr('fill', this.color.colorChart2);
  }
}
