type Status = 'Done' | 'Doing' | 'ToDo';

// Id of a node is optional since the id is created in the database
// so when sent to backend we don't give it any id

export interface INode {
    label: string;
    status: Status;
    priority: string;
    id?: number; //Could there be a more specific ID than just number?
    x: number;
    y: number;
    project_id: number;
}

export interface IEdge {
    source_id: number;
    target_id: number;
    project_id: number;
}

export interface IProject {
    id: number;
    owner_id: number;
    name: string;
    description: string;
}

export interface Registration {
    username: string;
    password: string;
    email: string;
}

export interface RegisterFormProps {
    createUser: (user: Registration) => Promise<boolean>;
}

export interface Login {
    email: string | null;
    username: string | null;
    password: string;
}

export interface UserToken {
    username: string;
    email: string;
    token: string;
    id: number;
}

export interface User {
    username: string;
    password: string;
    email: string;
    id: number;
}

export interface RootState {
    project: IProject[];
}

export interface ToolbarProps {
    createNode: (nodeText: string) => Promise<void>;
    layoutWithDagre: (direction: string) => Promise<void>;
    forceDirected: () => Promise<void>;
}

export interface ITag {
    id: number;
    label: string;
    color: string;
}

export interface ITaggedNode {
    node_id: string;
    tag_id: number
}
