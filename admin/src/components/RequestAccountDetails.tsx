// import React, { useEffect, useState } from "react";
// import avatar from "../assests/avatar.png";

// import {
//   FaIdCard,
//   FaBook,
//   FaHouseUser,
//   FaRegUser,
//   FaUserFriends,
//   FaUsers,
//   FaChevronDown,
//   FaChevronUp,
// } from "react-icons/fa";
// import { IoIosCloseCircle } from "react-icons/io";
// import { MdEmail, MdOutlineFamilyRestroom, MdPhone } from "react-icons/md";

// const API_URL = import.meta.env.VITE_BACKEND_URL;

// // ------------------ InputGroup Component ------------------
// interface InputGroupProps {
//   label: string;
//   name: string;
//   type?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   icon: React.ReactNode;
// }

// const InputGroup = ({ label, icon, ...rest }: InputGroupProps) => (
//   <>
//     <p className="text-blue-900 font-semibold mb-1">{label}</p>
//     <div className="flex items-center border-2 border-blue-900 rounded-lg px-3 mb-4 h-10">
//       {icon}
//       <input
//         {...rest}
//         className="flex-1 ml-3 text-blue-900 outline-none"
//       />
//     </div>
//   </>
// );

// // ------------------ Props type ------------------
// interface RequestAccountDetailsProps {
//   id: string;
//   setOpen: (value: boolean) => void;
// }

// // ------------------ Main Component ------------------
// function RequestAccountDetails({ id, setOpen }: RequestAccountDetailsProps) {
//   const [account, setAccount] = useState<any>({});
//   const [avatarFile, setAvatarFile] = useState<File | undefined>();
//   const [toggleAccount, setToggleAccount] = useState(false);
//   const [chapters, setChapters] = useState<any[]>([]);

// const handleRequest = async (status: "active" | "banned") => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await fetch(`${API_URL}/accounts/${id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//       body: JSON.stringify({ status }),
//     });

//     const result = await res.json();
//     console.log("PATCH RESPONSE:", result);

//     if (!result.success) {
//       alert("Duyệt thất bại: " + result.message);
//       return;
//     }

//     alert("Duyệt thành công!");
//     setOpen(false);

//   } catch (error) {
//     console.log("Error:", error);
//     alert("Không thể kết nối máy chủ");
//   }
// };


//   useEffect(() => {
//     const fetchChapters = async () => {
//       try {
//         const res = await fetch(`${API_URL}/chapters/all`);
//         const data = await res.json();
//         setChapters(data.data.chapters);
//       } catch (error) {
//         console.log("Lỗi:", error);
//       }
//     };

// const fetchAccount = async () => {
//   try {
//     const res = await fetch(`${API_URL}/accounts/${id}`);
//     const result = await res.json();

//     if (!result.success || !result.data) return;

//     const { account, infoMember, ...rest } = result.data;

//     let merged = {
//       ...(account || {}),
//       ...(infoMember || {}),
//       ...rest,
//     };

//     // chuẩn hóa ngày tháng
//     if (merged.birthday) merged.birthday = merged.birthday.slice(0, 10);
//     if (merged.joinedAt) merged.joinedAt = merged.joinedAt.slice(0, 10);

//     setAccount(merged);

//   } catch (err) {
//     console.log("Error:", err);
//   }
// };


//     fetchChapters();
//     fetchAccount();
//   }, [id]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setAccount((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setAccount((prev: any) => ({
//         ...prev,
//         avatar: URL.createObjectURL(file),
//       }));
//       setAvatarFile(file);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-blue-900 bg-opacity-40 z-50 flex justify-center items-center">
//       <div className="w-1/2 bg-white rounded-2xl relative">
        
//         <button
//           className="absolute top-2 right-2"
//           onClick={() => setOpen(false)}
//         >
//           <IoIosCloseCircle size={40} className="text-red-600" />
//         </button>

//         <div className="h-[700px] overflow-y-auto p-8">
//           <div className="flex">
//             <div className="flex-1 flex justify-center">
//               <div className="relative flex flex-col w-full px-10">

//                 <div className="absolute top-0 left-0 bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg">
//                   Chờ phê duyệt
//                 </div>

//                 {/* Avatar section */}
//                 <div className="flex flex-col items-center mt-10">
//                   <img
//                     src={account.avatar || avatar}
//                     alt="avatar"
//                     className="w-40 h-40 rounded-full border-4 border-blue-900 object-cover"
//                   />

//                   <input
//                     type="file"
//                     id="avatar"
//                     name="avatar"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleAvatarChange}
//                   />

//                   <label
//                     htmlFor="avatar"
//                     className="border-2 border-blue-900 text-blue-900 px-4 py-2 mt-3 rounded-lg cursor-pointer"
//                   >
//                     Chọn ảnh đại diện
//                   </label>
//                 </div>

//                 {/* Input groups */}
//                 <InputGroup
//                   label="Email"
//                   name="email"
//                   type="email"
//                   value={account.email || ""}
//                   onChange={handleChange}
//                   icon={<MdEmail size={26} className="text-blue-900" />}
//                 />

//                 <InputGroup
//                   label="Số điện thoại"
//                   name="phone"
//                   type="tel"
//                   value={account.phone || ""}
//                   onChange={handleChange}
//                   icon={<MdPhone size={26} className="text-blue-900" />}
//                 />

//                 <InputGroup
//                   label="Họ và tên"
//                   name="fullname"
//                   value={account.fullname || ""}
//                   onChange={handleChange}
//                   icon={<FaRegUser size={20} className="text-blue-900" />}
//                 />

//                 {/* Birthday + Gender */}
//                 <div className="flex gap-6">
//                   <div className="flex-1">
//                     <p className="text-blue-900 font-semibold mb-1">Ngày sinh</p>
//                     <input
//                       type="date"
//                       name="birthday"
//                       title="birthday"
//                       value={account.birthday || ""}
//                       onChange={handleChange}
//                       className="border-2 border-blue-900 rounded-lg px-3 w-full h-10 text-blue-900 outline-none"
//                     />
//                   </div>

//                   <div className="flex-1">
//                     <p className="text-blue-900 font-semibold mb-1">Giới tính</p>
//                     <select
//                       name="gender"
//                       title="gender"
//                       value={account.gender || "Nam"}
//                       onChange={handleChange}
//                       className="border-2 border-blue-900 rounded-lg px-3 w-full h-10 text-blue-900 outline-none"
//                     >
//                       <option value="">-- Chọn giới tính --</option>
//                       <option value="Nam">Nam</option>
//                       <option value="Nữ">Nữ</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Role */}
//                 <p className="text-blue-900 font-semibold mt-4">Vai trò</p>
//                 <div className="border-2 border-blue-900 rounded-lg px-3 h-10 flex items-center mb-4">
//                   {account.role === "member"
//                     ? "Đoàn viên"
//                     : account.role === "manager"
//                     ? "Người quản lý chi đoàn"
//                     : "Quản trị viên"}
//                 </div>

//                 {/* Member info */}
//                 {account.role === "member" && (
//                   <>
//                     <div
//                       className="flex items-center gap-4 cursor-pointer my-4"
//                       onClick={() => setToggleAccount(!toggleAccount)}
//                     >
//                       <p className="text-2xl font-bold text-blue-900">
//                         Thông tin đoàn viên
//                       </p>
//                       {toggleAccount ? (
//                         <FaChevronUp size={28} className="text-blue-900" />
//                       ) : (
//                         <FaChevronDown size={28} className="text-blue-900" />
//                       )}
//                     </div>

//                     {toggleAccount && (
//                       <>
//                         {/* Chi đoàn */}
//                         <p className="text-blue-900 font-semibold mb-1">
//                           Chi đoàn sinh hoạt
//                         </p>
//                         <select
//                           name="chapterId"
//                           title="chapterId"
//                           value={account.chapterId?._id || ""}
//                           onChange={handleChange}
//                           className="border-2 border-blue-900 rounded-lg px-3 w-full h-10 text-blue-900 mb-4"
//                         >
//                           <option value="">Chọn chi đoàn</option>
//                           {chapters.map((c) => (
//                             <option key={c._id} value={c._id}>
//                               {c.name}
//                             </option>
//                           ))}
//                         </select>

//                         <InputGroup
//                           label="Số thẻ đoàn"
//                           name="cardId"
//                           value={account.cardId || ""}
//                           onChange={handleChange}
//                           icon={<FaIdCard size={24} className="text-blue-900" />}
//                         />

//                         <div className="flex gap-6">
//                           <div className="flex-1">
//                             <p className="text-blue-900 font-semibold mb-1">
//                               Chức vụ
//                             </p>
//                             <select
//                               name="position"
//                               title="position"
//                               value={account.position || ""}
//                               onChange={handleChange}
//                               className="border-2 border-blue-900 w-full h-10 rounded-lg px-3"
//                             >
//                               <option value="Đoàn viên">Đoàn viên</option>
//                               <option value="Phó Bí thư">Phó Bí thư</option>
//                               <option value="Bí thư">Bí thư</option>
//                             </select>
//                           </div>

//                           <div className="flex-1">
//                             <p className="text-blue-900 font-semibold mb-1">
//                               Ngày vào đoàn
//                             </p>
//                             <input
//                               type="date"
//                               name="joinedAt"
//                               title="joinedAt"
//                               value={account.joinedAt || ""}
//                               onChange={handleChange}
//                               className="border-2 border-blue-900 rounded-lg px-3 w-full h-10"
//                             />
//                           </div>
//                         </div>

//                         <InputGroup
//                           label="Địa chỉ"
//                           name="address"
//                           value={account.address || ""}
//                           onChange={handleChange}
//                           icon={<FaHouseUser size={24} className="text-blue-900" />}
//                         />

//                         <InputGroup
//                           label="Quê quán"
//                           name="hometown"
//                           value={account.hometown || ""}
//                           onChange={handleChange}
//                           icon={
//                             <MdOutlineFamilyRestroom
//                               size={26}
//                               className="text-blue-900"
//                             />
//                           }
//                         />

//                         <InputGroup
//                           label="Dân tộc"
//                           name="ethnicity"
//                           value={account.ethnicity || ""}
//                           onChange={handleChange}
//                           icon={<FaUsers size={22} className="text-blue-900" />}
//                         />

//                         <InputGroup
//                           label="Tôn giáo"
//                           name="religion"
//                           value={account.religion || ""}
//                           onChange={handleChange}
//                           icon={<FaUserFriends size={22} className="text-blue-900" />}
//                         />

//                         <InputGroup
//                           label="Trình độ học vấn"
//                           name="eduLevel"
//                           value={account.eduLevel || ""}
//                           onChange={handleChange}
//                           icon={<FaBook size={22} className="text-blue-900" />}
//                         />
//                       </>
//                     )}
//                   </>
//                 )}

//                 {/* Manager */}
//                 {account.role === "manager" && (
//                   <>
//                     <p className="text-blue-900 font-semibold mb-1">
//                       Chi đoàn quản lý
//                     </p>
//                     <select
//                       name="chapterId"
//                       title="chapterId"
//                       value={account.managerOf || ""}
//                       onChange={handleChange}
//                       className="border-2 border-blue-900 w-full h-10 rounded-lg px-3 mb-4"
//                     >
//                       <option value="">Chọn chi đoàn</option>
//                       {chapters.map((c) => (
//                         <option key={c._id} value={c._id}>
//                           {c.name}
//                         </option>
//                       ))}
//                     </select>
//                   </>
//                 )}

//                 {/* Buttons */}
//                 <div className="flex justify-around mt-6">
//                   <button
//                     onClick={() => handleRequest("active")}
//                     className="bg-blue-900 text-white font-bold px-12 py-3 rounded-lg hover:bg-blue-700"
//                   >
//                     Duyệt
//                   </button>

//                   <button
//                     onClick={() => handleRequest("banned")}
//                     className="bg-red-600 text-white font-bold px-12 py-3 rounded-lg hover:bg-red-700"
//                   >
//                     Từ chối
//                   </button>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RequestAccountDetails;

// src/components/RequestAccountDetails.tsx
import React, { useEffect, useState } from "react";
import avatar from "../assests/avatar.png";

import {
  FaIdCard,
  FaBook,
  FaHouseUser,
  FaRegUser,
  FaUserFriends,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { MdEmail, MdOutlineFamilyRestroom, MdPhone } from "react-icons/md";

import {
  useGetAccountByIdQuery,
  useUpdateAccountByIdMutation,
} from "home/store";

// ------------------ InputGroup Component ------------------
interface InputGroupProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}

const InputGroup = ({ label, icon, ...rest }: InputGroupProps) => (
  <>
    <p className="text-blue-900 font-semibold mb-1">{label}</p>
    <div className="flex items-center border-2 border-blue-900 rounded-lg px-3 mb-4 h-10">
      {icon}
      <input {...rest} className="flex-1 ml-3 text-blue-900 outline-none" />
    </div>
  </>
);

// ------------------ Props type ------------------
interface RequestAccountDetailsProps {
  id: string;
  setOpen: (value: boolean) => void;
}

// ------------------ Main Component ------------------
function RequestAccountDetails({ id, setOpen }: RequestAccountDetailsProps) {
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [toggleAccount, setToggleAccount] = useState(false);
  const [chapters, setChapters] = useState<any[]>([]); // giả sử bạn có endpoint chapters/all

  // RTK Query
  const { data: accountData, isLoading } = useGetAccountByIdQuery(id);
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountByIdMutation();

  const [account, setAccount] = useState<any>({});

  // ------------------ Fetch chapters ------------------
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chapters/all`);
        const data = await res.json();
        setChapters(data.data.chapters);
      } catch (error) {
        console.log("Lỗi:", error);
      }
    };
    fetchChapters();
  }, []);

  // ------------------ Sync account from RTK Query ------------------
  useEffect(() => {
    if (accountData?.data) {
      const { account: acc, infoMember, ...rest } = accountData.data;
      const merged = {
        ...(acc || {}),
        ...(infoMember || {}),
        ...rest,
      };
      if (merged.birthday) merged.birthday = merged.birthday.slice(0, 10);
      if (merged.joinedAt) merged.joinedAt = merged.joinedAt.slice(0, 10);
      setAccount(merged);
    }
  }, [accountData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccount((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAccount((prev: any) => ({
        ...prev,
        avatar: URL.createObjectURL(file),
      }));
      setAvatarFile(file);
    }
  };

  const handleRequest = async (status: "active" | "banned") => {
    try {
      const formData = new FormData();
      formData.append("status", status);
      if (avatarFile) formData.append("avatar", avatarFile);

      const result = await updateAccount({ id, formData }).unwrap();

      if (!result.success) {
        alert("Duyệt thất bại: " + result.message);
        return;
      }

      alert("Duyệt thành công!");
      setOpen(false);
    } catch (error) {
      console.log("Error:", error);
      alert("Không thể kết nối máy chủ");
    }
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="fixed inset-0 bg-blue-900 bg-opacity-40 z-50 flex justify-center items-center">
      <div className="w-1/2 bg-white rounded-2xl relative">
        <button className="absolute top-2 right-2" onClick={() => setOpen(false)}>
          <IoIosCloseCircle size={40} className="text-red-600" />
        </button>

        <div className="h-[700px] overflow-y-auto p-8">
          <div className="flex">
            <div className="flex-1 flex justify-center">
              <div className="relative flex flex-col w-full px-10">
                <div className="absolute top-0 left-0 bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg">
                  Chờ phê duyệt
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center mt-10">
                  <img
                    src={account.avatar || avatar}
                    alt="avatar"
                    className="w-40 h-40 rounded-full border-4 border-blue-900 object-cover"
                  />

                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />

                  <label
                    htmlFor="avatar"
                    className="border-2 border-blue-900 text-blue-900 px-4 py-2 mt-3 rounded-lg cursor-pointer"
                  >
                    Chọn ảnh đại diện
                  </label>
                </div>

                {/* Input groups */}
                <InputGroup
                  label="Email"
                  name="email"
                  type="email"
                  value={account.email || ""}
                  onChange={handleChange}
                  icon={<MdEmail size={26} className="text-blue-900" />}
                />
                <InputGroup
                  label="Số điện thoại"
                  name="phone"
                  type="tel"
                  value={account.phone || ""}
                  onChange={handleChange}
                  icon={<MdPhone size={26} className="text-blue-900" />}
                />
                <InputGroup
                  label="Họ và tên"
                  name="fullname"
                  value={account.fullname || ""}
                  onChange={handleChange}
                  icon={<FaRegUser size={20} className="text-blue-900" />}
                />

                {/* Birthday + Gender */}
                <div className="flex gap-6">
                  <div className="flex-1">
                    <p className="text-blue-900 font-semibold mb-1">Ngày sinh</p>
                    <input
                      type="date"
                      title="birthday"
                      name="birthday"
                      value={account.birthday || ""}
                      onChange={handleChange}
                      className="border-2 border-blue-900 rounded-lg px-3 w-full h-10 text-blue-900 outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-900 font-semibold mb-1">Giới tính</p>
                    <select
                      name="gender"
                      title="gender"
                      value={account.gender || "Nam"}
                      onChange={handleChange}
                      className="border-2 border-blue-900 rounded-lg px-3 w-full h-10 text-blue-900 outline-none"
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                {/* Role */}
                <p className="text-blue-900 font-semibold mt-4">Vai trò</p>
                <div className="border-2 border-blue-900 rounded-lg px-3 h-10 flex items-center mb-4">
                  {account.role === "member"
                    ? "Đoàn viên"
                    : account.role === "manager"
                    ? "Người quản lý chi đoàn"
                    : "Quản trị viên"}
                </div>

                {/* Member info */}
                {account.role === "member" && (
                  <>
                    <div
                      className="flex items-center gap-4 cursor-pointer my-4"
                      onClick={() => setToggleAccount(!toggleAccount)}
                    >
                      <p className="text-2xl font-bold text-blue-900">
                        Thông tin đoàn viên
                      </p>
                      {toggleAccount ? (
                        <FaChevronUp size={28} className="text-blue-900" />
                      ) : (
                        <FaChevronDown size={28} className="text-blue-900" />
                      )}
                    </div>

                    {toggleAccount && (
                      <>
                        {/* Chi đoàn */}
                        <p className="text-blue-900 font-semibold mb-1">
                          Chi đoàn sinh hoạt
                        </p>
                        <select
                          name="chapterId"
                          title="chapter"
                          value={account.chapterId?._id || ""}
                          onChange={handleChange}
                          className="border-2 border-blue-900 rounded-lg px-3 w-full h-10 text-blue-900 mb-4"
                        >
                          <option value="">Chọn chi đoàn</option>
                          {chapters.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </select>

                        <InputGroup
                          label="Số thẻ đoàn"
                          name="cardId"
                          value={account.cardId || ""}
                          onChange={handleChange}
                          icon={<FaIdCard size={24} className="text-blue-900" />}
                        />

                        {/* Các thông tin khác của member */}
                      </>
                    )}
                  </>
                )}

                {/* Manager info */}
                {account.role === "manager" && (
                  <>
                    <p className="text-blue-900 font-semibold mb-1">Chi đoàn quản lý</p>
                    <select
                      name="chapterId"
                      title="chapterid"
                      value={account.managerOf || ""}
                      onChange={handleChange}
                      className="border-2 border-blue-900 w-full h-10 rounded-lg px-3 mb-4"
                    >
                      <option value="">Chọn chi đoàn</option>
                      {chapters.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {/* Buttons */}
                <div className="flex justify-around mt-6">
                  <button
                    onClick={() => handleRequest("active")}
                    className="bg-blue-900 text-white font-bold px-12 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Duyệt
                  </button>

                  <button
                    onClick={() => handleRequest("banned")}
                    className="bg-red-600 text-white font-bold px-12 py-3 rounded-lg hover:bg-red-700"
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestAccountDetails;
