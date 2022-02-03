import React, { FormEvent, useState } from 'react';
import { Node } from 'react-flow-renderer';
import { ITag, ITaggedNode } from '../../../../types';
import { basicNode } from '../App';

interface TagProps {
    data: ITag[];
    createTag: (tagLabel: string) => void;
    onTagEdit: (data: ITag) => void;
    onTagRemove: (id: number) => void;
}

export const Tag = (props: TagProps): JSX.Element => {
    const [tagLabel, settagLabel] = useState<string>('');

    const handleSubmit = (event: FormEvent) => {
        props.createTag(tagLabel);
        event.preventDefault();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    autoFocus
                    style={{ width: '100%' }}
                    type="text"
                    value={tagLabel}
                    onChange={(e) => {
                        settagLabel(e.target.value);
                    }}
                />
            </form>
            {props.data.map((tag) => (
                <p>{tag.label}</p>
            ))}
        </div>
    );
};
