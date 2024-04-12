import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BudgetChartComponent} from "./libs/chart/budget-chart/budget-chart.component";
import {SearchChartComponent} from "./libs/chart/search-chart/search-chart.component";
import {ConversationChartComponent} from "./libs/chart/conversation-chart/conversation-chart.component";
import {SuggestedChartComponent} from "./libs/chart/suggested-chart/suggested-chart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BudgetChartComponent,
    SearchChartComponent,
    ConversationChartComponent,
    SuggestedChartComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chart';
}
