import { useEffect, useState } from 'react';
import { INode, UserData } from '../../../../types';
import { getAssignedUsers } from '../services/assignmentService';

interface assignedUsersProps {
    node: INode;
}

export const AssignedUsers = (props: assignedUsersProps): JSX.Element => {
    const nodeId = props.node.id;
    if (!nodeId) return <></>;

    const [assigned, setAssigned] = useState<UserData[]>([]);

    useEffect(() => {
        getAssignedUsers(nodeId)
            .then((users) => setAssigned(users))
            .catch(() => setAssigned([]));
    }, []);

    return assigned.length ? (
        <div>
            <p>Assigned users:</p>
            <ul>
                {assigned.map((user) => (
                    <li>{user.username}</li>
                ))}
            </ul>
        </div>
    ) : (
        <></>
    );
};
