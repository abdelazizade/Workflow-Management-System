import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WorkflowBuilderComponent } from "./components/workflow-builder/workflow-builder.component";
import { NgxGraphModule } from '@swimlane/ngx-graph';


@Component({
  selector: 'app-root',
  imports: [DragDropModule, RouterModule, NgxGraphModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'workflow-system';



}
