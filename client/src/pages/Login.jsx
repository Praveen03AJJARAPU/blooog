import LoginTemp from "../components/LoginTemp"

function Login() {
  return (
    <div>
        <div className="px-10 block md:hidden border-2 border-b-black py-2">
            <p className="text-4xl font-dm">Blooog</p>
        </div>
        <div className="bg-slate flex justify-center h-[92vh] items-center">
            <LoginTemp />
        </div>
    </div>
  )
}

export default Login