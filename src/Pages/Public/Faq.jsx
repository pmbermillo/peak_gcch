import { useState, useEffect }  from 'react'
import Table from '../../Component/Table.jsx'
import { 
    XMarkIcon, 
    PaperAirplaneIcon, 
    PencilIcon, 
    TrashIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon
} from "@heroicons/react/24/solid";
import { toast } from 'react-toastify';
import { PostFaqs, GetFaqs, DeleteFaq } from '../../Api/Module/FaqsApi.jsx';
import {format} from 'date-fns';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useUser } from "../Auth/UserContext";
import * as XLSX from "xlsx";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [showFaqForm, setShowFaqForm] = useState(false);

    const filteredFaqs = data.filter((faq) => {
        const search = searchTerm.toLowerCase();

        return (
            faq.question?.toLowerCase().includes(search) ||
            faq.answer?.toLowerCase().includes(search) ||
            faq.category?.toLowerCase().includes(search) ||
            faq.sub_category?.toLowerCase().includes(search)
        );
    });

    const handleAddFaq = () => {
        clearForm();
        setShowFaqForm(true);
    };

    const exportToExcel = () => {
        const excelData = filteredFaqs.map((faq) => ({
            Question: faq.question,
            Answer: faq.answer,
            Category: faq.category,
            "Sub Category": faq.sub_category,
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "FAQs"
        );

        XLSX.writeFile(
            workbook,
            "FAQs.xlsx"
        );
    };

    const handleEditFaq = (faq) => {
        setFormData({
            question: faq.question ?? "",
            answer: faq.answer ?? "",
            category: faq.category ?? "",
            sub_category: faq.sub_category ?? "",
            id: faq.id ?? "",
        });

        setShowFaqForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

	const cols = [
        { header: 'Action', accessor: 'action',
            renderCell: (_, row) => (
                <div className="flex gap-2">
                    {["ADMIN","RTA","RA","SCHEDULER"].includes(user?.permission) && (
                        <button
                            type="button"
                            onClick={() => handleEditFaq(faq)}
                            className="
                                px-2
                                py-1
                                text-xs
                                bg-blue-500
                                text-white
                                rounded-md
                                hover:bg-blue-600
                                transition-colors
                            "
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
            clearForm();
            setShowFaqForm(false);
            setExpandedFaq(null);

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

    const clearForm = () => {
        setFormData({
            question: "",
            answer: "",
            category: "",
            sub_category: "",
            id: "",
        });
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
                <div className="w-full px-6 mt-6">
                {/* Add FAQ Button */}
                {!showFaqForm && (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={exportToExcel}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-green-700
                                bg-green-50
                                border
                                border-green-200
                                rounded-lg
                                hover:bg-green-100
                                transition

                            "
                        >
                            Export Excel
                        </button>
                        <button
                            type="button"
                            onClick={handleAddFaq}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                bg-gradient-to-r
                                from-blue-600
                                to-indigo-600
                                rounded-lg
                                shadow-sm
                                hover:from-blue-700
                                hover:to-indigo-700
                                hover:shadow-md
                                transition-all
                            "
                        >
                            <span className="text-lg leading-none">+</span>
                            Add New FAQ
                        </button>
                    </div>
                )}

                {/* FAQ Form */}
                {showFaqForm && (
                    <div className="
                        mb-6
                        bg-white
                        border
                        border-blue-100
                        rounded-2xl
                        shadow-md
                        overflow-hidden
                    ">

                        {/* Form Header */}
                        <div className="
                            px-6
                            py-4
                            bg-gradient-to-r
                            from-blue-50
                            to-indigo-50
                            border-b
                            border-blue-100
                            flex
                            items-center
                            justify-between
                        ">

                            <div>
                                <h2 className="
                                    text-base
                                    font-bold
                                    text-gray-800
                                ">
                                    {formData.id ? "Edit FAQ" : "Add New FAQ"}
                                </h2>

                                <p className="
                                    text-xs
                                    text-gray-500
                                    mt-0.5
                                ">
                                    {formData.id
                                        ? "Update the FAQ information below."
                                        : "Create a new frequently asked question."
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    clearForm();
                                    setShowFaqForm(false);
                                }}
                                className="
                                    p-2
                                    rounded-lg
                                    text-gray-400
                                    hover:text-gray-600
                                    hover:bg-white
                                    transition
                                "
                                title="Close"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>

                        </div>

                        {/* Form Body */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-6"
                        >

                            {/* Question */}
                            <div className="mb-5">

                                <label className="
                                    block
                                    text-xs
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                ">
                                    Question
                                </label>

                                <input
                                    type="text"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleChange}
                                    placeholder="Enter the frequently asked question..."
                                    className="
                                        w-full
                                        h-11
                                        px-4
                                        text-sm
                                        text-gray-700
                                        bg-gray-50
                                        border
                                        border-gray-200
                                        rounded-lg
                                        focus:outline-none
                                        focus:bg-white
                                        focus:border-blue-400
                                        focus:ring-4
                                        focus:ring-blue-50
                                        transition
                                    "
                                />

                            </div>

                            {/* Answer */}
                            <div className="mb-5">

                                <label className="
                                    block
                                    text-xs
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                ">
                                    Answer
                                </label>

                                <textarea
                                    name="answer"
                                    value={formData.answer}
                                    onChange={handleChange}
                                    placeholder="Enter the answer..."
                                    rows={6}
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        text-sm
                                        text-gray-700
                                        bg-gray-50
                                        border
                                        border-gray-200
                                        rounded-lg
                                        resize-y
                                        focus:outline-none
                                        focus:bg-white
                                        focus:border-blue-400
                                        focus:ring-4
                                        focus:ring-blue-50
                                        transition
                                    "
                                />

                                <p className="
                                    text-[11px]
                                    text-gray-400
                                    mt-1.5
                                ">
                                    Provide a clear and helpful answer.
                                </p>

                            </div>

                            {/* Category Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Category */}
                                <div>

                                    <label className="
                                        block
                                        text-xs
                                        font-semibold
                                        text-gray-700
                                        mb-2
                                    ">
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g. HR, Payroll, System"
                                        className="
                                            w-full
                                            h-11
                                            px-4
                                            text-sm
                                            text-gray-700
                                            bg-gray-50
                                            border
                                            border-gray-200
                                            rounded-lg
                                            focus:outline-none
                                            focus:bg-white
                                            focus:border-blue-400
                                            focus:ring-4
                                            focus:ring-blue-50
                                            transition
                                        "
                                    />
                                </div>

                                {/* Sub Category */}
                                <div>
                                    <label className="
                                        block
                                        text-xs
                                        font-semibold
                                        text-gray-700
                                        mb-2
                                    ">
                                        Sub Category
                                    </label>
                                    <input
                                        type="text"
                                        name="sub_category"
                                        value={formData.sub_category}
                                        onChange={handleChange}
                                        placeholder="e.g. Leave, Account, Access"
                                        className="
                                            w-full
                                            h-11
                                            px-4
                                            text-sm
                                            text-gray-700
                                            bg-gray-50
                                            border
                                            border-gray-200
                                            rounded-lg
                                            focus:outline-none
                                            focus:bg-white
                                            focus:border-blue-400
                                            focus:ring-4
                                            focus:ring-blue-50
                                            transition
                                        "
                                    />
                                </div>
                            </div>
                            {/* Buttons */}
                            <div className="
                                flex
                                justify-end
                                items-center
                                gap-3
                                mt-6
                                pt-5
                                border-t
                                border-gray-100
                            ">

                                <button
                                    type="button"
                                    onClick={() => {
                                        clearForm();
                                        setShowFaqForm(false);
                                    }}
                                    className="
                                        h-10
                                        px-4
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-medium
                                        text-gray-600
                                        bg-gray-100
                                        rounded-lg
                                        hover:bg-gray-200
                                        transition
                                    "
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="
                                        h-10
                                        px-5
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-semibold
                                        text-white
                                        bg-gradient-to-r
                                        from-blue-600
                                        to-indigo-600
                                        rounded-lg
                                        shadow-sm
                                        hover:from-blue-700
                                        hover:to-indigo-700
                                        hover:shadow-md
                                        transition-all
                                    "
                                >
                                    <PaperAirplaneIcon
                                        className="h-4 w-4 rotate-45"
                                    />

                                    {formData.id ? "Update FAQ" : "Save FAQ"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            )}
            <div className="w-full px-6 mt-6">
                 {/* FAQ Header */}
                <div className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    via-indigo-600
                    to-violet-600
                    px-8
                    py-8
                    mb-6
                    shadow-lg
                ">
                    {/* Decorative circles */}
                    <div className="
                        absolute
                        -top-12
                        -right-12
                        w-40
                        h-40
                        rounded-full
                        bg-white/10
                    " />
                    <div className="
                        absolute
                        -bottom-16
                        right-32
                        w-48
                        h-48
                        rounded-full
                        bg-white/5
                    " />
                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold text-white">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-sm text-blue-100 mt-2">
                            Find quick answers to your most common questions.
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="
                    relative
                    mb-6
                ">
                    <MagnifyingGlassIcon
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            h-5
                            w-5
                            text-blue-500
                        "
                    />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search questions, answers, categories..."
                        className="
                            w-full
                            h-12
                            pl-11
                            pr-4
                            text-sm
                            bg-white
                            border-2
                            border-blue-100
                            rounded-xl
                            shadow-sm
                            text-gray-700
                            placeholder-gray-400
                            focus:outline-none
                            focus:border-blue-400
                            focus:ring-4
                            focus:ring-blue-100
                            transition
                        "
                    />
                </div>

                {/* FAQ List */}
                <div className="space-y-3">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => {
                            const isOpen = expandedFaq === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className={`
                                        relative
                                        bg-white
                                        border
                                        rounded-xl
                                        overflow-hidden
                                        shadow-sm
                                        transition-all
                                        duration-200
                                        ${
                                            isOpen
                                                ? "border-blue-300 shadow-md "
                                                : "border-gray-200 hover:border-blue-200"
                                        }
                                    `}
                                >
                                    {/* Question */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedFaq(isOpen ? null : faq.id)
                                        }
                                        className={`
                                            w-full
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            px-5
                                            py-4
                                            text-left
                                            transition
                                            ${
                                                isOpen
                                                    ? "bg-blue-50/70"
                                                    : "hover:bg-blue-50/40"
                                            }
                                        `}
                                    >

                                        <div className="flex-1">

                                            <div className="flex items-center gap-2 mb-1">
                                                {faq.category && (
                                                    <span className="px-2 py-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 rounded-full">
                                                        {faq.category}
                                                    </span>
                                                )}

                                                {faq.sub_category && (
                                                    <span className="px-2 py-1 text-[10px] font-semibold text-purple-700 bg-purple-50 rounded-full">
                                                        {faq.sub_category}
                                                    </span>
                                                )}
                                            </div>

                                            <h3
                                                className={`
                                                    text-sm
                                                    font-semibold
                                                    ${
                                                        isOpen
                                                            ? "text-blue-700"
                                                            : "text-gray-800"
                                                    }
                                                `}
                                            >
                                                {faq.question}
                                            </h3>

                                        </div>

                                        <ChevronDownIcon
                                            className={`
                                                h-5
                                                w-5
                                                flex-shrink-0
                                                transition-transform
                                                ${
                                                    isOpen
                                                        ? "rotate-180 text-blue-500"
                                                        : "text-gray-400"
                                                }
                                            `}
                                        />

                                    </button>


                                    {/* ANSWER + ACTIONS */}
                                    {isOpen && (
                                        <div className="px-5 pb-5">

                                            <div className="pt-4 border-t border-gray-100">

                                                {/* Answer */}
                                                <div className="text-sm text-gray-600 leading-6 whitespace-pre-line">
                                                    {faq.answer}
                                                </div>


                                                {/* ACTION BUTTONS */}
                                                <div className="flex justify-end gap-2 mt-4">

                                                    {["ADMIN", "RTA", "RA", "SCHEDULER"].includes(user?.permission) && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();

                                                                handleEditFaq(faq);
                                                            }}
                                                            className="
                                                                px-3
                                                                py-1.5
                                                                flex
                                                                items-center
                                                                gap-1.5
                                                                text-xs
                                                                font-medium
                                                                text-blue-600
                                                                bg-blue-50
                                                                rounded-md
                                                                hover:bg-blue-100
                                                                transition
                                                            "
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                            Edit
                                                        </button>
                                                    )}

                                                    {["ADMIN"].includes(user?.permission) && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(faq.id);
                                                            }}
                                                            className="
                                                                px-3
                                                                py-1.5
                                                                flex
                                                                items-center
                                                                gap-1.5
                                                                text-xs
                                                                font-medium
                                                                text-red-600
                                                                bg-red-50
                                                                rounded-md
                                                                hover:bg-red-100
                                                                transition
                                                            "
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })

                    ) : (

                        <div
                            className="
                                text-center
                                py-12
                                bg-white
                                border
                                border-gray-200
                                rounded-xl
                            "
                        >
                            <MagnifyingGlassIcon
                                className="h-10 w-10 mx-auto text-gray-300 mb-3"
                            />
                            <p className="text-sm font-medium text-gray-600">
                                No FAQs found
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Try searching with a different keyword.
                            </p>
                        </div>
                    )}
                </div>
            </div>
			{/* <Table
                title="FAQs"
                columns={cols}
                data={data}
                tableClassName="w-full table-fixed"
                cellClassName="text-xs whitespace-normal break-words"
            /> */}
		</div>
    )
  }

  export default Faq