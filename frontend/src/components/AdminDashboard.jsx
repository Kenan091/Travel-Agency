import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Welcome admin!</h1>
      <table>th</table>
    </div>
  );
};

export default AdminDashboard;

// components/Feedback/FeedbackTable.js
// import React from 'react';

// const FeedbackTable = ({ feedback, onReply, onDelete }) => {
//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Form Number</th>
//           <th>Full Name</th>
//           <th>Date Created</th>
//           <th>Email Address</th>
//           <th>Comment</th>
//           <th>User ID</th>
//           <th>Actions</th>
//           <th>Reply</th>
//         </tr>
//       </thead>
//       <tbody>
//         {feedback.map(item => (
//           <tr key={item.id}>
//             <td>{item.formNumber}</td>
//             <td>{item.fullName}</td>
//             <td>{item.dateCreated}</td>
//             <td>{item.emailAddress}</td>
//             <td>{item.comment}</td>
//             <td>{item.userId}</td>
//             <td>
//               <button onClick={() => onDelete(item.id)}>Delete</button>
//             </td>
//             <td><button onClick={() => onReply(item.id)}>Reply</button></td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default FeedbackTable;

// components/Users/UsersTable.js
// import React from 'react';

// const UsersTable = ({ users, onDelete }) => {
//   return (

//   );
// };

// export default UsersTable;
