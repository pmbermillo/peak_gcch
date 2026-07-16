import React, { useEffect, useState } from "react";
import axios from "axios";
import { UpdateMemberAPI, GetMembersAPI, AddMemberAPI, DeleteMemberAPI } from '../../Api/Module/OrgChartApi';
import Select from "react-select";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useUser } from "../Auth/UserContext";

const NodeFormModal = ({ node, onClose, onSaved }) => {
    const { user } = useUser();
    const MySwal = withReactContent(Swal);
    if (!node) return null;
    const isEdit = !!node.id;
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        parent_id: '',
    });
    const [members, setMembers] = useState([]);
    const [memberOptions, setMemberOptions] = useState([]);

    useEffect(() => {
        console.log(members)
        if (members?.length) {
            setMemberOptions(
                members.map(m => ({
                    value: m.id,
                    label: m.name
                }))
            );
        }
    }, [members]);

    const fetchEmployees = async () => {
        const res = await GetMembersAPI();
        setMembers(res.data[0]);
        console.log( res)
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (node && memberOptions.length > 0) {
            setFormData({
                name: node.name || "",
                position: node.position || "",
                parent_id: node.parentId || ""
            });

            setPreview(node.image || "");
        }
    }, [node, memberOptions]);

    // ✅ Image preview
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);

        if (selected) {
        setPreview(URL.createObjectURL(selected));
        }
    };

    // ✅ Save (Create or Update)
    const handleSubmit = async () => {
        console.log(formData);
        try {
            const payload = new FormData();
            payload.append("name", formData.name);
            payload.append("position", formData.position);
            payload.append("parent_id", formData.parent_id || null);

            if (file) {
                payload.append("photo", file);
            }

            if(isEdit)
            {
                const res = await UpdateMemberAPI(node.id, payload);
                if(res.data.status == 'success')
                {
                    toast.success(res.data.message);
                }
                else
                {
                    toast.error(res.data.message);
                }
                console.log(res)
            }
            else
            {
                const res = await AddMemberAPI(payload);
                if(res.data.status == 'success')
                {
                    toast.success(res.data.message);
                }
                else
                {
                    toast.error(res.data.message);
                }
            }

            onSaved(); // refresh chart
            onClose(); // close modal

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                error.response?.data?.errors?.employee_id?.[0] ??
                error.response?.data?.error ??
                'Failed to submit form.'
            );
        }
    };

    // ✅ Delete
    const handleDelete = async () => {
        if (!isEdit) return;

        try {
            const result = await MySwal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            });

            if (!result.isConfirmed) return;

            const response = await DeleteMemberAPI(node.id);
            toast.success(response.data.message);

            onSaved(); 
            onClose(); 

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ?? "Failed to delete user"
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

                {/* HEADER */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {isEdit ? "Edit Employee" : "Add Employee"}
                </h3>

                {/* IMAGE */}
                <div className="flex flex-col items-center gap-2 mb-4">
                    <img
                        src={preview || "https://via.placeholder.com/80"}
                        alt=""
                        className="w-20 h-20 rounded-full object-cover border"
                    />

                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="text-sm"
                    />
                </div>

                {/* NAME */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* POSITION */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Position"
                        value={formData.position}
                        onChange={(e) =>
                            setFormData({ ...formData, position: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* SELECT */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Superior
                    </label>

                    <Select
                        options={memberOptions}
                        value={memberOptions.find(
                            (o) => String(o.value) === String(formData.parent_id)
                        )}
                        onChange={(selected) =>
                            setFormData((prev) => ({
                                ...prev,
                                parent_id: selected?.value || ""
                            }))
                        }
                        placeholder="Select or type Superior"
                        isClearable
                        isSearchable
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 mt-4">
                    {["ADMIN"].includes(user?.permission) && isEdit && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg"
                        >
                            Delete
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                    >
                        Cancel
                    </button>
                    {["ADMIN"].includes(user?.permission) && (
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

    // ✅ Simple styles (replace with Tailwind if you want)
    const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    };

    const modalStyle = {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    width: 300,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    };

    export default NodeFormModal;