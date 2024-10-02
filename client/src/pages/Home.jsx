import {Blogs, Suggestions, Nav} from '../sections/index'

function Home() {
  return (
    <div>
      <Nav />
      <div className="flex md:mx-16 lg:mx-24 border-x-4 justify-between">
        <span className='border-r-4'>

        <Blogs />
        </span>
        <div className='hidden lg:block border-l-4'>
          <Suggestions />
        </div>
      </div>
    </div>
  );
}

export default Home