import './pages.css'
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
// import {ImageResize} from 'quill-image-resize-module-react';
import { useDispatch, useSelector } from 'react-redux'
import { setContent } from '../../store/slices/editor';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


function Editor() {
  const dispatch = useDispatch();
  const [canPublished, setCanPublished] = useState(false);
  const content = useSelector((state) => state.editor.content);
  const nav = useNavigate();
  const handleChange = (e) => {
    dispatch(setContent(e))
  }


  useEffect(() => {
    if(content.length > 50) setCanPublished(true);
    else setCanPublished(false);
  },[content])

  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'] 
    ],
    
    
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'code-block', 'link', 'image', 'align', 'color', 'background'
  ];

  return (
    <div>
      <div className="flex items-center bg-third text-white justify-between px-10">
        <h1 className="font-lico font-bold text-4xl px-3 py-3">Philoog</h1>
        <Link
          className={`font-inter px-5 p-1 ${
            canPublished ? "bg-green-600" : "bg-green-300"
          } text-white rounded-full`}
          to='/publish'
        >
          Publish
        </Link>
      </div>
      <div className='w-full h-[90.7vh] bg-secondary'>
        <div
          className="pb-10 bg-white"
          style={{ maxWidth: "900px", margin: "auto", padding: "20px 0" }}
        >
          <ReactQuill
          style={{backgroundColor: ''}}
            value={content}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder="Write your story..."
            theme="snow"
          />
        </div>
      </div>
    </div>
  );
}

export default Editor;
