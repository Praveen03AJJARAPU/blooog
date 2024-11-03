import {motion} from 'framer-motion'
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { setActive } from '../../store/slices/animation';

function Search() {
  const {active} = useSelector((state) => state.anim);
  const dispatch = useDispatch();

  return (
    <div onClick={() => dispatch(setActive(true))} className="font-lico w-[250px] text-2xl bg-fourth py-1 pl-5 text-black rounded-3xl">
      <p>Search...</p>
    </div>
  );
}

export default Search