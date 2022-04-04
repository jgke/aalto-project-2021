import React, { useEffect, useState } from 'react';
import { Elements, Node } from 'react-flow-renderer';
import { Comment, INode, UserToken } from '../../../../types';
import * as nodeService from '../services/nodeService';
import { AssignedUsers } from './AssignedUsers';
import { AssignUsers } from './AssignUsers';
import { CommentSection } from './CommentSection';
import { NodeForm } from './NodeForm';

interface NodeDetailProps {
    element: Node<INode>;
    editMode: boolean;
    setElements: React.Dispatch<React.SetStateAction<Elements>>;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    user?: UserToken;
}

export const NodeDetail = (props: NodeDetailProps): JSX.Element => {
    const data = props.element.data;
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (data?.id) {
            nodeService
                .getComments(data.project_id, data.id)
                .then((comments) => setComments(comments));
        } else {
            setComments([]);
        }
    }, [data]);

    if (!data) {
        return <></>;
    }

    const sendComment = async (content: string) => {
        if (data.id) {
            const comment: Comment = {
                username: props.user?.username || '',
                users_id: props.user?.id || 0,
                node_id: data.id || 0,
                created: new Date().toISOString(),
                content,
            };

            await nodeService.sendComment(data.project_id, data.id, content);

            setComments(comments.concat(comment));
        }
    };

    let content;
    if (props.editMode) {
        content = (
            <>
                <h2>{data.label}</h2>
                <NodeForm
                    element={props.element}
                    setElements={props.setElements}
                    setEditMode={props.setEditMode}
                />
                <AssignUsers node={data} />
            </>
        );
    } else {
        content = (
            <>
                <h2>{data.label}</h2>
                <p>Status: {data.status}</p>
                <p>Priority: {data.priority}</p>
                <p>ID: {data.id}</p>
                <AssignedUsers node={data} />
                <CommentSection
                    comments={comments}
                    sendComment={sendComment}
                ></CommentSection>
            </>
        );
    }

    return (
        <>
            <h5>Node:</h5>
            {content}
        </>
    );
};
