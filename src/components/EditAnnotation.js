import React, { useState } from 'react';
import Button from '@codeday/topo/Atom/Button';
import {Textarea} from '@codeday/topo/Atom/Input';
import Box from '@codeday/topo/Atom/Box';
import PropTypes from 'prop-types';
import { AnnotationFactory } from 'annotpdf';
import {
  UiEdit, UiOk, UiX, UiTrash,
} from '@codeday/topocons/Icon';
import InfoBox from './InfoBox';

export default function EditAnnotation({
  onUpdate, onDelete, annotation, idx, children, ...props
}) {
  const [tempContents, setTempContents] = useState(annotation.contents);
  const [editing, setEditing] = useState(false);
  const okButton = (
    <Button
      h={6}
      onClick={() => {
        onUpdate(tempContents);
        setEditing(false);
      }}
    >
      <UiOk />
    </Button>
  );
  const trashButton = (
    <Button
      h={6}
      onClick={() => {
        setEditing(false);
      }}
    >
      <UiX />
    </Button>
  );
  const deleteButton = (
    <Button
      h={6}
      onClick={() => {
        onDelete(annotation.id);
      }}
    ><UiTrash />
    </Button>
  );
  const editButton = (
    <Button
      h={6}
      onClick={() => {
        setEditing(true);
        setTempContents(annotation.contents);
      }}
    >
      <UiEdit />
    </Button>
  );
  return (
    <InfoBox buttons={editing ? <Box>{okButton} {trashButton}</Box> : <Box>{editButton} {deleteButton}</Box>} {...props} heading={`Feedback #${idx}`}>
      {editing
        ? <Textarea value={tempContents} onChange={(e) => { setTempContents(e.target.value); }} /> : annotation.contents}
      {children}
    </InfoBox>
  );
}
