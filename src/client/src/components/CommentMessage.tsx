import React from 'react';
import { Comment } from '../../../../types';
import CSS from 'csstype';

interface CommentMessageProps {
    comment: Comment;
}

const commentStyle: CSS.Properties = {
    background: '#919191',
    borderRadius: '8px',
    padding: '8px',
    maxWidth: '75%',
    minWidth: '120px',
    position: 'relative',
    display: 'inline-block',
};

const timestampStyle: CSS.Properties = {
    margin: 0,
    position: 'absolute',
    fontSize: '7px',
    right: '8px',
    bottom: '0px',
};

export const CommentMessage = (props: CommentMessageProps): JSX.Element => {
    const comment = props.comment;

    if (!comment) {
        return <></>;
    }

    return (
        <div style={{ margin: '8px 0' }}>
            <p style={{ margin: 0 }}>
                <strong>{comment.username}</strong>
            </p>
            <div style={commentStyle} className="speech-bubble">
                <span style={{ margin: '0 0 8px 0' }}>{comment.content}</span>
                <span style={timestampStyle}>
                    {new Date(comment.created).toLocaleString()}
                </span>
            </div>
        </div>
    );
};
