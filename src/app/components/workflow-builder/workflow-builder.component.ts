import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from "../tasks/input/input.component";
import { ApprovalComponent } from "../tasks/approval/approval.component";
import { CallApiComponent } from "../tasks/call-api/call-api.component";

@Component({
  selector: 'app-workflow-builder',
  templateUrl: './workflow-builder.component.html',
  styleUrl: './workflow-builder.component.scss',
  standalone: true,
  imports: [DragDropModule, CommonModule, ReactiveFormsModule, InputComponent, ApprovalComponent, CallApiComponent]
})
export class WorkflowBuilderComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  jsPlumbInstance: any;
  workflow: any[] = [];
  taskStep: any;

  steps = [
    { name: 'Manual Input' },
    { name: 'Approval'},
    { name: 'Call Api'}
  ];

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const jsPlumbModule = await import('jsplumb');
      const { jsPlumb } = jsPlumbModule;
      this.jsPlumbInstance = jsPlumb.getInstance();

      this.jsPlumbInstance.importDefaults({
        Connector: ['Straight'],
        Anchors: ['RightMiddle', 'LeftMiddle'],
        Endpoint: ['Dot', { radius: 6 }],
        PaintStyle: { stroke: '#2980b9', strokeWidth: 2 },
        EndpointStyle: { fill: '#3498db' }
      });

      this.setupConnectionRules();
    }
  }

  drop(event: any) {
    const draggedItem = { ...event.previousContainer.data[event.previousIndex] };
    const newStepId = `step-${this.workflow.length}`;
    this.workflow.push({ ...draggedItem, id: newStepId });
    console.log(this.workflow);
    

    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.initPlumbForStep(newStepId);
        if (this.workflow.length > 1) {
          const prevId = this.workflow[this.workflow.length - 2].id;
          this.jsPlumbInstance.connect({
            source: prevId,
            target: newStepId,
            overlays: [['Arrow', { width: 10, length: 10, location: 1 }]]
          });
        }
      }
    }, 100);
  }

  initPlumbForStep(stepId: string) {
    const elem = document.getElementById(stepId);
    if (!elem) return;

    this.jsPlumbInstance.draggable(elem, { containment: 'parent' });

    this.jsPlumbInstance.addEndpoint(stepId, {
      anchor: 'RightMiddle',
        isSource: true,
        isTarget: false,
        endpoint: 'Dot',
        endpointStyle: { fill: '#3498db', radius: 10 }, // Blue dot
        paintStyle: { stroke: '#2980b9', strokeWidth: 4 },
        connectorStyle: { stroke: '#2980b9', strokeWidth: 3 },
        connector: ['Straight'],
    });

    this.jsPlumbInstance.addEndpoint(stepId, {
      anchor: 'LeftMiddle',
        isSource: false,
        isTarget: true,
        endpoint: 'Dot',
        endpointStyle: { fill: '#e74c3c', radius: 10 }, // Red dot
        paintStyle: { stroke: '#c0392b', strokeWidth: 3 },
        allowLoopback: false
    });
  }

  setupConnectionRules() {
    this.jsPlumbInstance.bind('beforeDrop', (info: any) => {
      const sourceId = info.sourceId;
      const targetId = info.targetId;
      console.log(info);
      
      if (sourceId === targetId) {
        console.warn(`Cannot connect a step to itself.`);
        return false;
      }
  
      const sourceIndex = this.workflow.findIndex(step => step.id === sourceId);
      const targetIndex = this.workflow.findIndex(step => step.id === targetId);
  
      console.log(sourceId);
      console.log(targetId);
      
      if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex < targetIndex && (targetIndex - sourceIndex) < 2) {
        return true;
      }
      console.warn(`Invalid connection from ${sourceId} to ${targetId}.`);
      return false;
    });

    console.log('final');
    
  }

  showDetailsOfStep(step: any){
    console.log(step);
    this.taskStep = step
  }
  
}

