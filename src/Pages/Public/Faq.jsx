import { useState, useEffect }  from 'react'
import Table from '../../Component/Table.jsx'
import { XMarkIcon, PaperAirplaneIcon, PencilIcon, TrashIcon} from "@heroicons/react/24/solid"; 
import { toast } from 'react-toastify';
import { PostFaqs, GetFaqs, DeleteFaq } from '../../Api/Module/FaqsApi.jsx';
import {format} from 'date-fns';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useUser } from "../Auth/UserContext";

const Faq = () => {
    const { user } = useUser();
    const MySwal = withReactContent(Swal);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "",
        sub_category: "",
        id: "",
    });
	const [data, setData] = useState([]); 

	const cols = [
        { header: 'Action', accessor: 'action',
            renderCell: (_, row) => (
                <div className="flex gap-2">
                    {["ADMIN","RTA","RA","SCHEDULER"].includes(user?.permission) && (
                        <button
                            onClick={() => {
                                setFormData({
                                    question: row.question ?? "",
                                    answer: row.answer ?? "",
                                    category: row.category ?? "",
                                    sub_category: row.sub_category ?? "",
                                    id: row.id ?? "",
                                });
                            }}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                    )}
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
        { header: "Question", accessor: "question" },
        { header: "Answer", accessor: "answer" },
        { header: "Category", accessor: "category" },
        { header: "Sub Category", accessor: "sub_category" },
        { header: "Created At", accessor: "created_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
        { header: "Updated At", accessor: "updated_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
        { header: "Created By", accessor: "created_by" },
        { header: "Updated By", accessor: "updated_by" },
	];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await PostFaqs(formData);
            console.log('Form submitted successfully:', response);
            await fetchData();
            await clearForm();
            toast.success(response.data.message);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                error.response?.data?.errors?.message?.[0] ??
                error.response?.data?.message ??
                'Failed to submit form.'
            );
        }
    };

    const clearForm = async () => {
		setFormData({
			question: "",
			answer: "",
			category: "",
			sub_category: "",
			id: "",
		});
	}

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
                        const response = await DeleteFaq({ id }); // your API call
                        toast.success(response.data.message);
                        await fetchData(); // refresh table
                    } catch (error) {
                        toast.error(error.response?.data?.message ?? "Failed to delete report");
                    }
                }
            });
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error(
                error.response?.data?.errors?.message?.[0] ??
                error.response?.data?.message ??
                'Failed to delete report.'
            );
        }
    }

    const fetchData = async () => {
        try {
            const response = await GetFaqs();
            if (response && response.data) {
                setData(response.data[0]);
            }
            console.log(response);
        } catch (error) {
            console.error('Error fetching FAQ data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
		<div>
            {["ADMIN", "RA", "RTA", "SCHEDULER"].includes(user?.permission) && (
                <div className="w-full max-w-6xl mx-auto px-4">
                    <form className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm" onSubmit={handleSubmit}>
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                        Add FAQ
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-medium text-gray-600 mb-1">
                                Frequently Asked Question
                            </label>
                            <input
                                type="text"
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                placeholder="Enter question"
                                className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-medium text-gray-600 mb-1">
                                Answer
                            </label>
                            <textarea
                                name="answer"
                                value={formData.answer}
                                onChange={handleChange}
                                placeholder="Enter answer"
                                className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-medium text-gray-600 mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Enter category"
                                className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-medium text-gray-600 mb-1">
                                Sub Category
                            </label>
                            <input
                                type="text"
                                name="sub_category"
                                value={formData.sub_category}
                                onChange={handleChange}
                                placeholder="Enter sub category"
                                className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-3 gap-2">
                        <button
                            type="button"
                            className="h-8 px-3 flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                            title="Cancel"
                            onClick={clearForm}
                        >
                            <XMarkIcon className="h-4 w-4" />
                            <span>Cancel</span>
                        </button>

                        <button
                            type="submit"
                            className="h-8 px-3 flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                            title="Submit"
                        >
                            <PaperAirplaneIcon className="h-4 w-4 rotate-45" />
                            <span>Save</span>
                        </button>
                    </div>
                </form>
                </div>
            )}
			<Table title="FAQs"columns={cols} data={data} />
		</div>
    )
  }

  export default Faq