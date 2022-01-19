type Status = 'Done' | 'Doing' | 'ToDo';

// Id of a node is optional since the id is created in the database
// so when sent to backend we don't give it any id

export interface INode {
    label: string;
    status: Status;
    priority: string;
    id?: string;
    x: number;
    y: number;
}

export interface IEdge {
    source_id: string;
    target_id: string;
}
