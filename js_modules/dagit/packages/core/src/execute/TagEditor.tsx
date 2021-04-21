import {Button, Classes, Dialog, Icon} from '@blueprintjs/core';
import {IconNames} from '@blueprintjs/icons';
import * as React from 'react';
import styled from 'styled-components/macro';

import {PipelineRunTag} from '../app/LocalStorage';
import {ShortcutHandler} from '../app/ShortcutHandler';
import {RunTag} from '../runs/RunTag';
import {Group} from '../ui/Group';

interface ITagEditorProps {
  permanentTags?: PipelineRunTag[];
  editableTags: PipelineRunTag[];
  open: boolean;
  onChange: (tags: PipelineRunTag[]) => void;
  onRequestClose: () => void;
}

interface ITagContainerProps {
  tags: PipelineRunTag[];
  onRequestEdit: () => void;
}

export const TagEditor: React.FC<ITagEditorProps> = ({
  permanentTags = [],
  editableTags = [],
  open,
  onChange,
  onRequestClose,
}) => {
  const [editState, setEditState] = React.useState(() =>
    editableTags.length ? editableTags : [{key: '', value: ''}],
  );

  const toSave: PipelineRunTag[] = editState
    .map((tag: PipelineRunTag) => ({
      key: tag.key.trim(),
      value: tag.value.trim(),
    }))
    .filter((tag) => tag.key && tag.value);
  const toError = editState
    .map((tag: PipelineRunTag) => ({
      key: tag.key.trim(),
      value: tag.value.trim(),
    }))
    .filter((tag) => !tag.key !== !tag.value);

  const onSave = () => {
    if (!toError.length) {
      onChange(toSave);
      onRequestClose();
    }
  };

  const disabled = editState === editableTags || !!toError.length;

  const onTagEdit = (key: string, value: string, idx: number) => {
    setEditState((current) => [...current.slice(0, idx), {key, value}, ...current.slice(idx + 1)]);
  };

  const onRemove = (idx: number) => {
    setEditState((current) => [...current.slice(0, idx), ...current.slice(idx + 1)]);
  };

  const addTagEntry = () => {
    setEditState((current) => [...current, {key: '', value: ''}]);
  };

  return (
    <Dialog
      icon="info-sign"
      onClose={onRequestClose}
      style={{minWidth: 500}}
      title={'Add tags to pipeline run'}
      usePortal={true}
      isOpen={open}
    >
      <div
        className={Classes.DIALOG_BODY}
        style={{
          margin: 0,
          marginBottom: 17,
          height: `calc(100% - 85px)`,
          position: 'relative',
        }}
      >
        <Group padding={16} spacing={16} direction="column">
          {permanentTags.length ? (
            <TagList>
              {permanentTags.map((tag, idx) => (
                <RunTag tag={tag} key={idx} />
              ))}
            </TagList>
          ) : null}
          <div>
            {editState.map((tag, idx) => {
              const {key, value} = tag;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: 10,
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Tag Key"
                    value={key}
                    onChange={(e) => onTagEdit(e.target.value, value, idx)}
                  />
                  <Input
                    type="text"
                    placeholder="Tag Value"
                    value={value}
                    onChange={(e) => onTagEdit(key, e.target.value, idx)}
                  />
                  <Remove onClick={() => onRemove(idx)} />
                </div>
              );
            })}
            <LinkButton onClick={addTagEntry}>+ Add another tag</LinkButton>
          </div>
        </Group>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onRequestClose}>Cancel</Button>
          <ShortcutHandler
            shortcutLabel="⌥Enter"
            shortcutFilter={(e) => e.keyCode === 13 && e.altKey}
            onShortcut={onSave}
          >
            <Button intent="primary" onClick={onSave} disabled={disabled}>
              Apply
            </Button>
          </ShortcutHandler>
        </div>
      </div>
    </Dialog>
  );
};

export const TagContainer = ({tags, onRequestEdit}: ITagContainerProps) => {
  return (
    <Container>
      <TagList>
        {tags.map((tag, idx) => (
          <RunTag tag={tag} key={idx} />
        ))}
      </TagList>
      <TagEditorLink onRequestOpen={onRequestEdit}>
        <div style={{whiteSpace: 'nowrap'}}>
          <Icon icon={IconNames.EDIT} iconSize={12} style={{marginBottom: 2}} /> Edit Tags
        </div>
      </TagEditorLink>
    </Container>
  );
};

interface ITagEditorLinkProps {
  onRequestOpen: () => void;
  children: React.ReactNode;
}

const TagEditorLink = ({onRequestOpen, children}: ITagEditorLinkProps) => (
  <ShortcutHandler
    shortcutLabel={'⌥T'}
    shortcutFilter={(e) => e.keyCode === 84 && e.altKey}
    onShortcut={onRequestOpen}
  >
    <Link onClick={onRequestOpen}>{children}</Link>
  </ShortcutHandler>
);

const Remove = styled(Icon).attrs({icon: IconNames.CROSS})`
  align-self: center;
  color: #aaaaaa;
  cursor: pointer;
  border: 1px solid transparent;
  padding: 3px;
  &:hover {
    color: #999999;
    border: 1px solid #cccccc;
    border-radius: 1px;
  }
`;

const Input = styled.input`
  flex: 1;
  margin-right: 10px;
  border-radius: 3px;
  font-size: 14px;
  padding: 3px 7px;
  border: 1px solid #cccccc;
`;
const Container = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #ececec;
  padding: 4px 8px;
`;
const TagList = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;
const Link = styled.div`
  color: #666;
  cursor: pointer;
  margin: 4px 12px;
  font-size: 12px;
  &:hover {
    color: #aaa;
  }
`;
const LinkButton = styled.button`
  background: inherit;
  border: none;
  cursor: pointer;
  font-size: inherit;
  text-decoration: none;
  color: #106ba3;
  &:hover {
    text-decoration: underline;
  }
`;
