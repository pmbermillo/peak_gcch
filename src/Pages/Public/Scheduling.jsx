import React, { useState, useEffect, useRef} from 'react'
import LinkForm from '../../Component/LinkForm.jsx'
import Table from '../../Component/Table.jsx'
import { AddLinkAPI, GetLinksAPI, DeleteLinkAPI } from '../../Api/Module/LinksApi.jsx'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useUser } from "../Auth/UserContext";

const Report = () => {
    const { user } = useUser();
    const MySwal = withReactContent(Swal);
    const [data, setData] = useState([]);
    const [category, setCategory] = useState('SCHEDULING');
    const [editData, setEditData] = useState({
        id: '',
        title: '',
        link: '',
        remarks: '',
    });
    const formRef = useRef();

    const handleLinkSubmit = async (data) => {
        console.log('Submitted Link Data:', data);

        try {
            const response = await AddLinkAPI(data);
            if(response.data.status == 'success')
                toast.success(response.data.message);
            else
                toast.error(response.data.message);
            await fetchLinks();
        } catch (error) {
            toast.error('An error occurred while submitting the link.');
        }
        await handleCancel();
    }

    const handleCancel = () => {
        setEditData({
            id: '',
            title: '',
            link: '',
            remarks: '',
        });

        formRef.current?.clearForm(); // 🔥 important
    };

    const handlDelete = async (id) => {
        console.log('Delete Link ID:', id);
        
    }

    const cols = [
        { header: 'Action', accessor: 'action',
            renderCell: (_, row) => (
                <div className="flex gap-2">
                    {/* Edit Button */}
                    {["ADMIN","RTA","RA","SCHEDULER"].includes(user?.permission) && (
                        <button
                            onClick={() => {
                                console.log('Edit Link ID:', row);
                                setEditData({
                                    id: row.id,
                                    title: row.title,
                                    link: row.url,
                                    remarks: row.remarks,
                                });
                            }}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                    )}
                    {/* Delete Button */}
                    {["ADMIN"].includes(user?.permission) && (
                        <button
                            onClick={() => handleDelete(row.id)} // 🔥 call a delete handler
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            )
        },
        { header: 'Remarks', accessor: 'remarks' },
        {
            header: 'Title',
            accessor: 'title',
            renderCell: (value, row) => (
                <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    {value}
                </a>
            )
        },
        { header: 'Created By', accessor: 'created_by' },
        { header: 'Created At', accessor: 'created_at', renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd"):"" },
        { header: 'Updated By', accessor: 'updated_by' },
        { header: 'Updated At', accessor: 'updated_at', renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd"):"" },
    ];

    const fetchLinks = async () => {
        const res = await GetLinksAPI({category});
        setData(res.data[0]);
        if(res.data.status == 'success')
            toast.success(res.data.message);
        else
            toast.error(res.data.message);
        console.log( res.data)
    };

    const handleDelete = async (id) => {
        try {
            MySwal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await DeleteLinkAPI({ id }); // your API call
                        toast.success(response.data.message);
                        await fetchLinks(); // refresh table
                    } catch (error) {
                        toast.error(error.response?.data?.message ?? "Failed to delete report");
                    }
                }
            });
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error(
                error.response?.data?.errors?.employee_id?.[0] ??
                error.response?.data?.error ??
                'Failed to delete report.'
            );
        }
    }

    useEffect(() => {
        fetchLinks();
    }, []);
    
    return (
        <div>
            {["ADMIN", "RA", "RTA", "SCHEDULER"].includes(user?.permission) && (
                <LinkForm category={category} onSubmit={handleLinkSubmit} initialData={editData} ref={formRef} onCancel={handleCancel}/>
            )}
            <br/>
            <Table title="Scheduling"columns={cols} data={data} /> 
        </div>
    )
}

export default Report