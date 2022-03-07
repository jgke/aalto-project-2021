import React, { FormEvent, useState } from 'react';
// import { ITag, ITaggedNode } from '../../../../types';
import { ITag } from '../../../../types';
import * as tagService from '../services/tagService';

interface TagProps {
    tags: ITag[];
    setTags: React.Dispatch<React.SetStateAction<ITag[]>>;
    projId: number;
}

export const Tag = (props: TagProps): JSX.Element => {
    const [hasInited, setInited] = useState<boolean>(false);

    const [tagLabel, settagLabel] = useState<string>('');

    const handleSubmit = (event: FormEvent) => {
        createTag(tagLabel);
        settagLabel('');
        event.preventDefault();
    };

    const createTag = async (tagLabel: string): Promise<void> => {
        const t: ITag = {
            id: 0,
            label: tagLabel,
            color: 'red',
            project_id: props.projId,
        };
        const returnId: number | undefined = await tagService.sendTag(t);
        if (returnId) {
            t.id = returnId;
            //setTags(tags.concat(t));
            await refreshTagList(props.projId);
        }
    };

    /*
    const onTagEdit = async (data: ITag) => {
        props.setTags((tgs) =>
            tgs.map((tg) => {
                if (tg.id === data.id) {
                    tg = data;
                }
                return tg;
            })
        );

        await tagService.updateTag(data);
    };
    */

    const onTagRemove = async (id: number) => {
        const idx = props.tags.findIndex((t) => t.id === id);
        if (idx >= 0) {
            console.log('deleting tag: ', props.tags[idx]);
            await tagService.deleteTag(props.tags[idx]);
            //setTags(tags.splice(idx, 1));
            await refreshTagList(props.projId);
        } else {
            console.log('could not find tag with id: ', id);
        }
    };

    const refreshTagList = async (projId: number): Promise<void> => {
        try {
            //console.log('refreshing tag list');
            const tagList = await tagService.getAllForProj(projId);
            // TODO: limit the number of tags returned from tagService
            //console.log(tagList[0].label)
            props.setTags(tagList.slice(0, 49));
        } catch (e) {
            console.log('Error in tagService.getAll', e);
        }
    };

    const clickTag = async (id: number): Promise<void> => {
        try {
            await onTagRemove(id);
        } catch (e) {
            console.log('Error in tagService.clickTag', e);
        }
    };

    const init = async () => {
        refreshTagList(props.projId);

        setInited(true);
    };

    if (!hasInited) {
        init();
    }

    return (
        <div className="tag-sidebar">
            <form onSubmit={handleSubmit}>
                <input
                    autoFocus
                    style={{ width: '100%' }}
                    type="text"
                    placeholder="Tag Name"
                    value={tagLabel}
                    onChange={(e) => {
                        settagLabel(e.target.value);
                    }}
                />
            </form>
            <div className="tag-taglist">
                {props.tags.map((tag) => (
                    <button
                        className="tag-disptag"
                        key={tag.id}
                        onClick={async () => {
                            await clickTag(tag.id);
                        }}
                    >
                        {tag.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
