import { CirclePlay } from "lucide-react";

export default function Login() {
    return (  
        <div className="gradient h-dvh min-h-screen w-full flex items-center justify-center ">
            <div className=" p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center ">
                <img src="/logo.svg" alt="Logo" className="w-16 h-16 mb-4" />
                <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Login</h1>
                <p className="mb-6 text-center w-full">Welcome back! Please enter your credentials.</p>

                {/* Social Login Buttons with Icons */}
                <div className="w-full flex flex-col gap-3 mb-6">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border font-semibold"
                    >
                        <CirclePlay className="w-5 h-5" />
                        Continue with Google
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border font-semibold"
                    >
                        <CirclePlay className="w-5 h-5" />
                        Continue with Apple
                    </button>
                </div>

                <div className="flex items-center w-full mb-6">
                    <div className="flex-grow h-px "></div>
                    <span className="mx-3 text-sm">or</span>
                    <div className="flex-grow h-px"></div>
                </div>

                <form action="/login" method="POST" className="w-full">
                    <div className="mb-5">
                        <label htmlFor="username" className="block font-semibold mb-2 ">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block font-semibold mb-2 ">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 "
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white py-3 rounded-lg font-bold"
                    >
                        Login
                    </button>
                    <div className="flex justify-between items-center text-sm">
                        <a href="#" className="hover:underline">Forgot Password?</a>
                        <span>|</span>
                        <a href="/register" className="hover:underline">Create Account</a>
                    </div>
                </form>
            </div>
        </div>
    )
}