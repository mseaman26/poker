// pages/login.js
import { signIn } from 'next-auth/react';
import LoginForm from '@/components/login/loginForm';

const LoginPage = () => {
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Replace with your actual form data handling logic
//     const email = e.target.email.value;
//     const password = e.target.password.value;

//     // Initiate the authentication process
//     await signIn('credentials', { email, password });
//   };

  return (
    <LoginForm/>
    // <div>
    //   <h1>Login</h1>
    //   <form onSubmit={handleSubmit}>
    //     <label>
    //       Email:
    //       <input type="text" id="email" name="email" required />
    //     </label>
    //     <br />
    //     <label>
    //       Password:
    //       <input type="password" id="password" name="password" required />
    //     </label>
    //     <br />
    //     <button type="submit">Login</button>
    //   </form>
    // </div>
  );
};

export default LoginPage;
