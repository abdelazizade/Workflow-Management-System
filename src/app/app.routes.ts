import { Routes } from '@angular/router';
import { WorkflowBuilderComponent } from './components/workflow-builder/workflow-builder.component';
import { AllTasksComponent } from './components/all-tasks/all-tasks.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'task', component: WorkflowBuilderComponent},
    {path: 'tasks', component: AllTasksComponent},
    {path: '**', component: AllTasksComponent},
];
