


// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import AuthButton from './AuthButton';

// // const HeroSection = () => {
// //   const navigate = useNavigate();
// //   const [activeTab, setActiveTab] = useState('login');
// //   const [userType, setUserType] = useState('student');
  
// //   // Mock login function
// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     // In a real app, you would validate credentials here
// //     if (activeTab === 'login' && userType === 'student') {
// //       navigate('/student-dashboard');
// //     } 
// //     else if(activeTab === 'login' && userType === 'teacher')
// //       navigate('/teacher-dashboard');

// //     else {
// //       // Handle teacher login or signup flow
// //       alert("This functionality is still under development");
// //     }
// //   };
  
// //   return (
// //     <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
// //       {/* Left Section - Text Content */}
// //       <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
// //         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
// //           Simplify Attendance <span className="gradient-text">Management</span>
// //         </h1>
// //         <p className="text-xl text-gray-600 mb-8">
// //           Track student attendance effortlessly with our intuitive platform designed for both teachers and students.
// //         </p>
// //       </div>
      
// //       {/* Right Section - Auth Cards */}
// //       <div className="md:w-1/2">
// //         <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md mx-auto animate-float">
// //           {/* Tab Buttons */}
// //           <div className="flex mb-8 bg-gray-100 rounded-full p-1">
// //             <button 
// //               type="button"
// //               onClick={() => setActiveTab('login')}
// //               className={`flex-1 py-2 rounded-full font-medium transition-all ${
// //                 activeTab === 'login' 
// //                   ? 'bg-white shadow-sm text-attendblue'
// //                   : 'text-gray-500 hover:text-gray-700'
// //               }`}
// //             >
// //               Login
// //             </button>
// //             <button 
// //               type="button"
// //               onClick={() => setActiveTab('signup')}
// //               className={`flex-1 py-2 rounded-full font-medium transition-all ${
// //                 activeTab === 'signup' 
// //                   ? 'bg-white shadow-sm text-attendpurple'
// //                   : 'text-gray-500 hover:text-gray-700'
// //               }`}
// //             >
// //               Sign Up
// //             </button>
// //           </div>
          
// //           {/* User Type Toggle */}
// //           <div className="flex justify-center mb-8">
// //             <div className="inline-flex bg-gray-100 rounded-full p-1">
// //               <button 
// //                 type="button"
// //                 onClick={() => setUserType('student')}
// //                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
// //                   userType === 'student' 
// //                     ? 'bg-white shadow-sm text-attendpurple'
// //                     : 'text-gray-500 hover:text-gray-700'
// //                 }`}
// //               >
// //                 Student
// //               </button>
// //               <button 
// //                 type="button"
// //                 onClick={() => setUserType('teacher')}
// //                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
// //                   userType === 'teacher' 
// //                     ? 'bg-white shadow-sm text-attendblue'
// //                     : 'text-gray-500 hover:text-gray-700'
// //                 }`}
// //               >
// //                 Teacher
// //               </button>
// //             </div>
// //           </div>
          
// //           <h3 className="text-2xl font-bold text-center mb-6">
// //             {activeTab === 'login' ? 'Welcome Back!' : 'Create Your Account'}
// //           </h3>
          
// //           {/* Form Fields */}
// //           <div className="space-y-4 mb-8">
// //             {activeTab === 'signup' && userType === 'student' && (
// //               <>
// //                 <div>
// //                   <label htmlFor="roll_no" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
// //                   <input
// //                     type="text"
// //                     id="roll_no"
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue focus:border-attendblue"
// //                     placeholder="Enter your roll number"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
// //                   <input
// //                     type="text"
// //                     id="name"
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue focus:border-attendblue"
// //                     placeholder="Enter your full name"
// //                   />
// //                 </div>
// //               </>
// //             )}
// //             {activeTab === 'signup' && userType === 'teacher' && (
// //               <>
// //                 <div>
// //                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
// //                   <input
// //                     type="text"
// //                     id="name"
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue focus:border-attendblue"
// //                     placeholder="Enter your full name"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
// //                   <input
// //                     type="text"
// //                     id="subjects"
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue focus:border-attendblue"
// //                     placeholder="Enter subjects you teach"
// //                   />
// //                 </div>
// //               </>
// //             )}
            
// //             <div>
// //               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
// //               <input
// //                 type="email"
// //                 id="email"
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue focus:border-attendblue"
// //                 placeholder="Enter your email"
// //               />
// //             </div>
            
// //             <div>
// //               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
// //               <input
// //                 type="password"
// //                 id="password"
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue focus:border-attendblue"
// //                 placeholder="Enter your password"
// //               />
// //             </div>
// //           </div>
          
// //           {/* Action Button */}
// //           <AuthButton 
// //             text={activeTab === 'login' ? 'Login' : 'Sign Up'} 
// //             type={userType === 'student' ? 'student' : 'teacher'}
// //           />
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default HeroSection;








// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthButton from './AuthButton';
// import axios from 'axios';

// const HeroSection = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('login');
//   const [userType, setUserType] = useState('student');
//   const [formData, setFormData] = useState({
//     roll_no: '',
//     name: '',
//     email: '',
//     password: '',
//     subjects: ''
//   });

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.id]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const endpoint = `http://localhost:4000/api/${userType}/${activeTab}`;
    
//     try {
//       if (activeTab === 'login') {
//         const response = await axios.post(endpoint, {
//           email: formData.email,
//           password: formData.password
//         });

//         localStorage.setItem('token', response.data.token);
//         if (userType === 'student') navigate('/student-dashboard');
//         else navigate('/teacher-dashboard');

//       } else {
//         // Signup
//         const payload = userType === 'student'
//           ? {
//               roll_no: formData.roll_no,
//               name: formData.name,
//               email: formData.email,
//               password: formData.password
//             }
//           : {
//               name: formData.name,
//               email: formData.email,
//               password: formData.password,
//               subjects: formData.subjects
//             };

//         const res = await axios.post(endpoint, payload);

//         alert('You have signed up successfully! Please login.');
//         setActiveTab('login');
//         setFormData({
//           roll_no: '',
//           name: '',
//           email: '',
//           password: '',
//           subjects: ''
//         });
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
//       <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
//         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
//           Simplify Attendance <span className="gradient-text">Management</span>
//         </h1>
//         <p className="text-xl text-gray-600 mb-8">
//           Track student attendance effortlessly with our intuitive platform designed for both teachers and students.
//         </p>
//       </div>

//       <div className="md:w-1/2">
//         <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md mx-auto animate-float">
          
//           {/* Tab Buttons */}
//           <div className="flex mb-8 bg-gray-100 rounded-full p-1">
//             <button type="button" onClick={() => setActiveTab('login')}
//               className={`flex-1 py-2 rounded-full font-medium transition-all ${activeTab === 'login' ? 'bg-white shadow-sm text-attendblue' : 'text-gray-500 hover:text-gray-700'}`}>
//               Login
//             </button>
//             <button type="button" onClick={() => setActiveTab('signup')}
//               className={`flex-1 py-2 rounded-full font-medium transition-all ${activeTab === 'signup' ? 'bg-white shadow-sm text-attendpurple' : 'text-gray-500 hover:text-gray-700'}`}>
//               Sign Up
//             </button>
//           </div>

//           {/* User Type Toggle */}
//           <div className="flex justify-center mb-8">
//             <div className="inline-flex bg-gray-100 rounded-full p-1">
//               <button type="button" onClick={() => setUserType('student')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${userType === 'student' ? 'bg-white shadow-sm text-attendpurple' : 'text-gray-500 hover:text-gray-700'}`}>
//                 Student
//               </button>
//               <button type="button" onClick={() => setUserType('teacher')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${userType === 'teacher' ? 'bg-white shadow-sm text-attendblue' : 'text-gray-500 hover:text-gray-700'}`}>
//                 Teacher
//               </button>
//             </div>
//           </div>

//           <h3 className="text-2xl font-bold text-center mb-6">
//             {activeTab === 'login' ? 'Welcome Back!' : 'Create Your Account'}
//           </h3>

//           <div className="space-y-4 mb-8">
//             {/* Sign Up Specific Fields */}
//             {activeTab === 'signup' && userType === 'student' && (
//               <>
//                 <div>
//                   <label htmlFor="roll_no" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
//                   <input type="text" id="roll_no" value={formData.roll_no} onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
//                 </div>
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                   <input type="text" id="name" value={formData.name} onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
//                 </div>
//               </>
//             )}

//             {activeTab === 'signup' && userType === 'teacher' && (
//               <>
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                   <input type="text" id="name" value={formData.name} onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
//                 </div>
//                 <div>
//                   <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
//                   <input type="text" id="subjects" value={formData.subjects} onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
//                 </div>
//               </>
//             )}

//             {/* Common Fields */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//               <input type="email" id="email" value={formData.email} onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <input type="password" id="password" value={formData.password} onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
//             </div>
//           </div>

//           <AuthButton text={activeTab === 'login' ? 'Login' : 'Sign Up'} type={userType} />
//         </form>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;






import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthButton from './AuthButton';
import axios from 'axios';

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    roll_no: '',
    name: '',
    email: '',
    password: '',
    subjects: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Correct Endpoint Mapping
    let endpoint = '';
    if (userType === 'student' && activeTab === 'signup') {
      endpoint = 'http://localhost:4000/api/student/register';
    } else if (userType === 'student' && activeTab === 'login') {
      endpoint = 'http://localhost:4000/api/student/login';
    } else if (userType === 'teacher' && activeTab === 'signup') {
      endpoint = 'http://localhost:4000/api/auth/register'; // Update if different
    } else if (userType === 'teacher' && activeTab === 'login') {
      endpoint = 'http://localhost:4000/api/auth/login';
    }

    try {
      console.log('Form Data:', formData);
      console.log('Endpoint:', endpoint); // Debugging line
      console.log('User Type:', userType); // Debugging line
      console.log('Active Tab:', activeTab); 
       // Debugging line
      if (activeTab === 'login') {
        const response = await axios.post(endpoint, {
          email: formData.email,
          password: formData.password
        });
        console.log('Login Response:', response.data); // Debugging line

        localStorage.setItem('token', response.data.token);
        if(userType=='student')
          localStorage.setItem('roll_no', response.data.student.roll_no); // Store user type in local storage
        document.cookie = `token=${response.data.token}; path=/; max-age=3600;`;

        if (userType === 'student') navigate('/student-dashboard');
        else navigate('/teacher-dashboard');

      } else {
        const payload = userType === 'student'
          ? {
              roll_no: formData.roll_no,
              name: formData.name,
              email: formData.email,
              password: formData.password
            }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              subjects: formData.subjects
            };

        await axios.post(endpoint, payload);

        alert('You have signed up successfully! Please login.');
        setActiveTab('login');
        setFormData({
          roll_no: '',
          name: '',
          email: '',
          password: '',
          subjects: ''
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Simplify Attendance <span className="gradient-text">Management</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Track student attendance effortlessly with our intuitive platform designed for both teachers and students.
        </p>
      </div>

      <div className="md:w-1/2">
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md mx-auto animate-float">
          <div className="flex mb-8 bg-gray-100 rounded-full p-1">
            <button type="button" onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 rounded-full font-medium transition-all ${activeTab === 'login' ? 'bg-white shadow-sm text-attendblue' : 'text-gray-500 hover:text-gray-700'}`}>
              Login
            </button>
            <button type="button" onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 rounded-full font-medium transition-all ${activeTab === 'signup' ? 'bg-white shadow-sm text-attendpurple' : 'text-gray-500 hover:text-gray-700'}`}>
              Sign Up
            </button>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              <button type="button" onClick={() => setUserType('student')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${userType === 'student' ? 'bg-white shadow-sm text-attendpurple' : 'text-gray-500 hover:text-gray-700'}`}>
                Student
              </button>
              <button type="button" onClick={() => setUserType('teacher')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${userType === 'teacher' ? 'bg-white shadow-sm text-attendblue' : 'text-gray-500 hover:text-gray-700'}`}>
                Teacher
              </button>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-center mb-6">
            {activeTab === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </h3>

          <div className="space-y-4 mb-8">
            {activeTab === 'signup' && userType === 'student' && (
              <>
                <div>
                  <label htmlFor="roll_no" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input type="text" id="roll_no" value={formData.roll_no} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" id="name" value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
                </div>
              </>
            )}

            {activeTab === 'signup' && userType === 'teacher' && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" id="name" value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
                </div>
                <div>
                  <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
                  <input type="text" id="subjects" value={formData.subjects} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" value={formData.password} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-attendblue" />
            </div>
          </div>

          <AuthButton text={activeTab === 'login' ? 'Login' : 'Sign Up'} type={userType} />
        </form>
      </div>
    </div>
  );
};

export default HeroSection;
