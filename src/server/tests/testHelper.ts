import { INode, IProject } from '../../../types';
import { Database } from '../dbConfigs';
import { v4 as uuidv4 } from 'uuid';

export const addDummyProject = async (
    db: Database,
    project?: IProject
): Promise<string> => {
    const p: IProject = project || {
        name: 'Test-1',
        description: 'First-project',
        owner_id: uuidv4(),
        id: 'temp',
    };

    return (
        await db.query(
            'INSERT INTO project (name, owner_id, description) VALUES ($1, $2, $3) RETURNING id',
            [p.name, p.owner_id, p.description]
        )
    ).rows[0].id as string;
};

export const addDummyNodes = async (
    db: Database,
    projectId: string,
    nodes?: INode[]
): Promise<string[]> => {
    const n = nodes || [
        {
            label: 'First-node',
            priority: 'Very Urgent',
            status: 'Doing',
            x: 0,
            y: 0,
            project_id: projectId,
        },
        {
            label: 'Second-node',
            priority: 'Urgent',
            status: 'ToDo',
            x: 1,
            y: 1,
            project_id: projectId,
        },
    ];

    const ids: string[] = [];
    for (const node of n) {
        const res = await db.query(
            'INSERT INTO node (label, priority, status, x, y, project_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;',
            [
                node.label,
                node.priority,
                node.status,
                node.x,
                node.y,
                node.project_id,
            ]
        );
        ids.push(res.rows[0].id);
    }

    return ids;
};
