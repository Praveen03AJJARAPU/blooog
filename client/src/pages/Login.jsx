import LoginTemp from "../components/LoginTemp"

function Login() {
  return (
    <div className="bg-primary text-fourth">
        <div className="px-10 block md:hidden py-2">
            <p className="text-4xl font-lime">Philoog</p>
        </div>
        <div className="bg-slate flex justify-center h-[100vh] items-center">
            <LoginTemp />
        </div>
    </div>
  )
}

export default Login