// export interface ITask {
//     id: string;
//     type: 'approval' | 'api' | 'manual';
//     position: { x: number; y: number };
//     config: any;
//     status?: 'pending' | 'running' | 'completed' | 'failed';
// }

// export interface IWorkflow {
//     id: string;
//     name: string;
//     tasks: ITask[];
//     links: { source: string; target: string }[];
// }

// export interface Task {
//     id: number;
//     name: string;
//     type: 'Approval' | 'ApiCall' | 'ManualInput';
//     config?: any;
// }

export interface Task {
    id: string;
    name: string;
    type: 'approval' | 'api' | 'manual';
    x: number;
    y: number;
    properties: {
      [key: string]: any;
    };
    outputs: {
      [condition: string]: string; // target task ID
    };
  }
  
  export const TASK_TEMPLATES = {
    approval: {
      name: 'Approval',
      properties: {
        approvers: [],
        timeout: 24
      },
      outputs: {
        'approved': '',
        'rejected': '',
        'timeout': ''
      }
    },
    api: {
      name: 'API Call',
      properties: {
        url: '',
        method: 'GET',
        headers: {},
        body: ''
      },
      outputs: {
        'success': '',
        'error': ''
      }
    },
    manual: {
      name: 'Manual Input',
      properties: {
        fields: []
      },
      outputs: {
        'complete': ''
      }
    }
  };