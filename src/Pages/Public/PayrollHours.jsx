import React, { useState, useEffect, useRef} from 'react'
import LinkForm from '../../Component/LinkForm.jsx'
import Table from '../../Component/Table.jsx'
import { AddLinkAPI, GetLinksAPI, DeleteLinkAPI, GetFoldersAPI } from '../../Api/Module/LinksApi.jsx'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useUser } from "../Auth/UserContext";
import FolderTree from '../../Component/FolderTree.jsx';
import FolderModal from '../../Component/FolderModal.jsx';

const PayrollHours = () => {
    const { user } = useUser();
    const MySwal = withReactContent(Swal);
    const [data, setData] = useState([]);
    const [category, setCategory] = useState('PAYROLL HOURS');
    const [editData, setEditData] = useState({
        id: '',
        title: '',
        link: '',
        remarks: '',
    });
    const formRef = useRef();
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [formMode, setFormMode] = useState(null);
    const [folderName, setFolderName] = useState("");

    const handleLinkSubmit = async (data) => {
        try {
            const response = await AddLinkAPI(data);
            if(response.data.status == 'success')
            {
                toast.success(response.data.message);
                if (data.type === "folder") {
                    if (selectedFolder?.id === data.id) {
                        setSelectedFolder(prev => ({
                            ...prev,
                            title: data.title,
                        }));
                    }
                    await fetchFolders();           // Refresh folder tree
                    setFormMode(null);

                    setEditData({
                        id: "",
                        title: "",
                    });
                } else {
                    await fetchLinks(selectedFolder?.id); // Refresh links table
                    setShowLinkForm(false);
                    setEditData({
                        id: "",
                        title: "",
                        link: "",
                        remarks: "",
                    });
                }
            }
            else
                toast.error(response.data.message);
            await fetchLinks(selectedFolder?.id);
            setShowLinkForm(false);
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

        formRef.current?.clearForm();
    };

    const cols = [
        { header: 'Action', accessor: 'action',
            renderCell: (_, row) => (
                <div className="flex gap-2">
                    {/* Edit Button */}
                    {["RTA", "SCHEDULER", "RA", "ADMIN"].includes(user?.permission) && (
                        <button
                            onClick={() => {
                                console.log('Edit Link ID:', row);
                                setEditData({
                                    id: row.id,
                                    title: row.title,
                                    link: row.url,
                                    remarks: row.remarks,
                                });
                                setShowLinkForm(true);
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

    const fetchFolders = async () => {
        const res = await GetFoldersAPI({ category });
        setFolders(res.data[0]); 
    };

    const fetchLinks = async (folderId) => {
        let data = {
            category,
            parent_id: folderId || null,
        };
        
        const res = await GetLinksAPI(data);
        console.log(res);
        setData(res.data[0]); 
    };

    const handleFolderClick = async (folder) => {
        console.log('Selected Folder:', folder);
        setSelectedFolder(folder);
        await fetchLinks(folder.id);
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
                        await fetchLinks(selectedFolder?.id); // refresh table
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

    const handleAddFolder = (folder) => {
        setSelectedFolder(folder);

        setEditData({
            id: "",
            title: "",
        });

        setFormMode("folder");
    };

    const handleEditFolder = (folder) => {
        setSelectedFolder(folder);

        setEditData({
            id: folder.id,
            title: folder.title,
            parent_id: folder.parent_id,
        });

        setFormMode("folder");
    };

    const handleDeleteFolder = async (folder) => {
        const result = await MySwal.fire({
            title: "Delete Folder?",
            text: `Are you sure you want to delete "${folder.title}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await DeleteLinkAPI({
                    id: folder.id,
                });

            toast.success(response.data.message);

            await fetchFolders();

            // If the deleted folder is currently selected,
            // clear the right panel.
            if (selectedFolder?.id === folder.id) {
                setSelectedFolder(null);
                setData([]);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ??
                "Failed to delete folder."
            );
        }
    };

    useEffect(() => {
        fetchFolders();
    }, []);
    
    return (
        <div>
            {["ADMIN", "RA"].includes(user?.permission) && (
                <LinkForm
                    category={category}
                    showFolder={true}
                    mode={formMode}
                    parentId={selectedFolder?.id}
                    onSubmit={handleLinkSubmit}
                    initialData={editData}
                    ref={formRef}
                    onCancel={() => {
                        setFormMode(null);
                        handleCancel();
                    }}
                />
            )}
            <br/>
            <div className="grid grid-cols-12 gap-4">
                {/* Left */}
                <div className="col-span-4">
                    <FolderTree
                        folders={folders}
                        onFolderClick={handleFolderClick}
                        onAddFolder={handleAddFolder}
                        onEditFolder={handleEditFolder}
                        onDeleteFolder={handleDeleteFolder}
                    />
                </div>
                {/* Right */}
                <div className="col-span-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            {selectedFolder
                                ? `📁 ${selectedFolder.title}`
                                : "Select a folder"}
                        </h2>
                        {["RTA", "SCHEDULER", "RA", "ADMIN"].includes(user?.permission) &&
                        selectedFolder && (
                            <button
                                className="rounded-lg bg-black px-4 py-2 text-white"
                                onClick={() => setShowLinkForm(true)}
                            >
                                + New Link
                            </button>
                        )}
                    </div>
                    {selectedFolder ? (
                        <>
                            {showLinkForm && (
                                <LinkForm
                                    category={category}
                                    parentId={selectedFolder?.id}
                                    showFolder={false}
                                    initialData={editData}
                                    onSubmit={handleLinkSubmit}
                                    onCancel={() => setShowLinkForm(false)}
                                    ref={formRef}
                                />
                            )}
                            <Table
                                title=""
                                columns={cols}
                                data={data}
                            />
                        </>
                    ) : (
                        <div className="flex h-80 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500">
                            Select a folder to view its links.
                        </div>
                    )}
                </div>
            </div>
            <FolderModal
                open={showFolderModal}
                folder={selectedFolder}
                onClose={() => setShowFolderModal(false)}
            >
                <LinkForm
                    category={category}
                    parentId={selectedFolder?.id}
                    showFolder={true}
                    onSubmit={handleLinkSubmit}
                    onCancel={() => setShowFolderModal(false)}
                />
                <br />
                <Table
                    title={selectedFolder?.title}
                    columns={cols}
                    data={data}
                />
            </FolderModal>
        </div>
    )
}

export default PayrollHours