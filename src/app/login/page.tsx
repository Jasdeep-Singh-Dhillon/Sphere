import { CirclePlay } from "lucide-react";

export default function Login() {
    return (  
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-blue-200 via-white to-blue-300 dark:bg-gradient-to-tr dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="bg-white/90 p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center dark:bg-gray-900/90 dark:shadow-black">
                <img src="/logo.svg" alt="Logo" className="w-16 h-16 mb-4" />
                <h1 className="text-3xl font-extrabold text-blue-700 mb-2 dark:text-blue-300">Login</h1>
                <p className="text-gray-500 mb-6 text-center w-full dark:text-gray-300">Welcome back! Please enter your credentials.</p>

                {/* Social Login Buttons with Icons */}
                <div className="w-full flex flex-col gap-3 mb-6">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                        <CirclePlay className="w-5 h-5" />
                        Continue with Google
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                        <CirclePlay className="w-5 h-5" />
                        Continue with Apple
                    </button>
                </div>

                <div className="flex items-center w-full mb-6">
                    <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                    <span className="mx-3 text-gray-400 dark:text-gray-500 text-sm">or</span>
                    <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                </div>

                <form action="/login" method="POST" className="w-full">
                    <div className="mb-5">
                        <label htmlFor="username" className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-600"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-600"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-3 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        Login
                    </button>
                    <div className="flex justify-between items-center text-sm">
                        <a href="#" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Forgot Password?</a>
                        <span className="text-gray-400 dark:text-gray-600">|</span>
                        <a href="/register" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Create Account</a>
                    </div>
                </form>
            </div>
        </div>
    )
}