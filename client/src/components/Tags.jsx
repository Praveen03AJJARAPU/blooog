import {Stack, Chip, TextField} from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addTags, deletTags } from '../../store/slices/editor';
function Tags() {
    const [input, setInput] = useState("");
    const dispatch = useDispatch();
    const {tags} = useSelector((state) => state.editor);
    const handleTags = (e) => {
        if(e.key == 'Enter' && input.trim() != "") {
            dispatch(addTags(input.trim()));
            setInput('');
        }
    }

    const handleDelete = (tag) => {
        dispatch(deletTags(tag));
    }
  return (
    <Stack direction="column" gap={1} width={'300px'}>
      <div>
        {tags.map((tag, id) => (
          <Chip style={{margin:'5px'}} key={id} label={tag} onDelete={() => handleDelete(tag)} />
        ))}
      </div>
      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        variant="outlined"
        className=''
        size="small"
        onKeyDown={handleTags}
      />
    </Stack>
  );
}

export default Tags