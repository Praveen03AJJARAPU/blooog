
import SearchAnim from '../components/SearchAnim';
import Hero from '../sections/Hero';
import {Blogs, Suggestions, Nav, Footer, Topics} from '../sections/index'

function Home() {
  
  return (
    <div className="relative overflow-hidden">
      <Nav />
      <Hero />
      <Topics />
      <SearchAnim />
      <div className="bg-fourth flex justify-between gap-5  pt-10 lg:px-16">
        <div>
          <h1 className="font-lime text-4xl md:text-6xl px-5 xl:text-8xl">Blogs</h1>
          <div className='flex flex-col items-center w-[100vw] lg:w-full'>
            <Blogs />
            <Blogs />
          </div>
        </div>
        <div className="hidden font-anto lg:block">
          <Suggestions />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home